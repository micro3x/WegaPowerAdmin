var mysql = require('mysql');
var dataHadler = require('./dataHandler')

var DataContext = function (dbSettings) {

    var connection = mysql.createConnection(dbSettings);

    saveData = function (data) {
       connection.query('INSERT INTO readingsData SET ?', data, function (error, results, fields) {
            if (error) {
                throw error;
            }
        });
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
        saveData: saveData
    }
}

module.exports = {
    DataContext: DataContext
}