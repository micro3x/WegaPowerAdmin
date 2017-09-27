var mysql = require('mysql');
var dataHadler = require('./dataHandler')

var DataContext = function (dbSettings) {

    var connection = mysql.createConnection(dbSettings);

    var saveData = function (data) {
        connection.query('INSERT INTO readingsData SET ?', data, function (error, results, fields) {
            if (error) {
                throw error;
            }
        });
    }

    var getNotTransmitedData = function () {
        return new Promise(function (resolve, reject) {
            connection.query("SELECT * FROM readingsData WHERE transmited = 0", function (error, data, fields) {
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
        })
    }

    var markAsTransmited = function (transmitedData) {
        var transmitedIds = [];
        for (var idx in transmitedData) {
            if (transmitedData[idx]['success']) {
                transmitedIds.push(dataChunk[idx]['id']);
            }
        }
        var queryStr = "UPDATE readingsData SET transmited = 1 WHERE id IN (" + transmitedIds.join(", ") + ");";
        connection.query(queryStr, function (error, data) {
            if (error) {
                console.log(error);
            }
        })
    }

    var getSerialPort = function () {
        return getSettingsValue('serialPort');
    }

    function getSettingsValue(settingKey) {
        if (settingKey) {
            return new Promise(function (resolve, reject) {
                connection.query("SELECT settingValue FROM settings WHERE settingKey = " + settingKey, function (error, data, fields) {
                    if (error) {
                        return reject(error);
                    }
                    resolve(data[0]);
                });
            })
        }
        throw { message: "Invalid input" };
    }

    return {
        saveData: saveData,
        getNotTransmitedData: getNotTransmitedData,
        markAsTransmited: markAsTransmited,
        getSerialPort: getSerialPort,
    }
}

module.exports = {
    DataContext: DataContext
}