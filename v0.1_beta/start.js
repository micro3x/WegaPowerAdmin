
var serialCom = require("./serialCom")
var dataHandler = require("./dataHandler")
var serverCom = require('./serverCom')
var dbContext = require('./dataDB')

var READINTERVAL = 1000;
var CONSOLIDATEINTERVAL = 60000;
var TRANSMITINTERVAL = 60000;

//todo: get settings from Db and then create SerialPort
var ser = serialCom.SerialCommonicator('/dev/ttyS1');
//todo: get settings from Db and then create Server
var server = serverCom.ServerCommunicator({ url: 'asd', port: 123 })
var dbSettings = {
    host: 'localhost',
    user: 'wega',
    password: 'wega',
    database: 'wegaDB'
}
var db = dbContext.DataContext(dbSettings);
var dataBuffer = new dataHandler.DataBuffer(CONSOLIDATEINTERVAL / 1000)
// VARS AND CONSTS
// var now = new Date;
// var currentTime = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
//     now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()) / 1000;


ser.port.on("data", function (data) {
    var dataReceived = dataHandler.transformData(data);

    if (dataReceived) {
        //ToDo: handle data Check if it is stateData or Not
        switch (dataReceived.func) {
            case 4: // State Packet
                dataBuffer.add(dataReceived);
                // console.log('dataRead');
                break;

            default:
                break;
        }
    }
})

function commintData() {
    var avgData = dataBuffer.consolidate();
    db.saveData(avgData);
}

setInterval(ser.requestData, READINTERVAL)

setInterval(commintData, CONSOLIDATEINTERVAL)

