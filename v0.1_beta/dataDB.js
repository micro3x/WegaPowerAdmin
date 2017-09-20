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

    var markAsTransmited = function (id) {
        var queryStr = "UPDATE readingsData SET transmited = 1 WHERE id = " + id;
        connection.query(queryStr, function (error, data) {
            if (error) {
                console.log(error);
            }
        })
    }



    // function consolidationCheck() {
    //     var isConsolidationTime = false;
    //     connection.query('SELECT MIN(`utc_time`) as mini, MAX(`utc_time`) as maxi FROM wegaDB.readingsData', function (error, results, fields) {
    //         if (error) {
    //             throw error;
    //         }
    //         console.log(results[0])
    //         console.log((results[0].maxi - results[0].mini) > 59)
    //         if ((results[0].maxi - results[0].mini) > 59) {
    //             isConsolidationTime = true;
    //         }
    //     });
    //     return isConsolidationTime;
    // }

    return {
        saveData: saveData,
        getNotTransmitedData: getNotTransmitedData,
        markAsTransmited: markAsTransmited
    }
}

module.exports = {
    DataContext: DataContext
}