
var serialCom = require("./serialCom")
var dataHandler = require("./dataHandler")
var serverCom = require('./serverCom')
var dbContext = require('./dataDB')

var READINTERVAL = 1;
var CONSOLIDATEINTERVAL = 60;
var TRANSMITINTERVAL = 60;
var TRANSMITCHUNKSIZE = 10;

//todo: get settings from Db and then create SerialPort
var ser = serialCom.SerialCommonicator('/dev/ttyUSB0');
//todo: get settings from Db and then create Server
var serverSettings = {
    baseUrl: "https://parse.buddy.com/parse",
    appId: "d95ab750-2b57-45db-aa4b-623bcc541108",
    username: "prototype",
    password: "wega1"
}
var server = serverCom.ServerCommunicator(serverSettings);
var dbSettings = {
    host: 'localhost',
    user: 'wega',
    password: 'wega',
    database: 'wegaDB'
}
var db = dbContext.DataContext(dbSettings);
var dataBuffer = new dataHandler.DataBuffer(CONSOLIDATEINTERVAL)
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

function commitData() {
    var avgData = dataBuffer.consolidate();
    db.saveData(avgData);
}

function transmitData() {
    db.getNotTransmitedData().then(function (data) {
        if (data.length > 0) {
            var dataChunk = data;
            if (data.length > TRANSMITCHUNKSIZE) {
                dataChunk = dataChunk.slice((TRANSMITCHUNKSIZE * -1));
            }
            server.transmit(dataChunk).then(function (response) {
                if (response.response['statusCode'] === 200) {
                    for (var idx in response.data) {
                        if(response.data[idx]['success']){
                            var id = dataChunk[idx]['id'];
                            db.markAsTransmited(id);
                        }
                    }
                }
            })
        }
    })
}

setInterval(ser.requestData, READINTERVAL * 1000)

setInterval(commitData, CONSOLIDATEINTERVAL * 1000)

setInterval(transmitData, TRANSMITINTERVAL * 1000)
// transmitData();