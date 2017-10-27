var mysql = require('mysql');

var DataContext = function (dbSettings) {

    var connection = mysql.createConnection(dbSettings);

    var saveData = function (data) {
        connection.query('INSERT INTO readingsData SET ?', data, function (error, results, fields) {
            if (error) {
                console.log(error);
            }
        });
    }

    var getNotTransmittedData = function () {
        return new Promise(function (resolve, reject) {
            connection.query("SELECT * FROM readingsData WHERE transmitted = 0", function (error, data, fields) {
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
        })
    }

    var markAsTransmitted = function (transmittedData) {
        var transmittedIds = [];
        for (var idx in transmittedData) {
            if (transmittedData[idx]['success']) {
                transmittedIds.push(transmittedData[idx]['id']);
            }
        }
        var queryStr = "UPDATE readingsData SET transmitted = 1 WHERE id IN (" + transmittedIds.join(", ") + ");";
        connection.query(queryStr, function (error, data) {
            if (error) {
                console.log(error);
            }
        })
    }

    var saveCurrentSettings = function (settings) {
        //todo: 1. identify type of settings to be saved
        
        //todo: 2. Update Settings in DB
    }

    var getCurrentSettings = function () {
        //todo: get settings from DB and return
    }

    return {
        saveData: saveData,
        getNotTransmittedData: getNotTransmittedData,
        markAsTransmitted: markAsTransmitted,
        saveCurrentSettings: saveCurrentSettings,
        getCurrentSettings: getCurrentSettings
    }
}

module.exports = {
    DataContext: DataContext
}