
var fs = require('fs');
var serialCom = require('./serialCom');
var dataHandler = require('./dataHandler');
var serverCom = require('./serverCom');
var dbContext = require('./dataDB');

var appSettings = JSON.parse(fs.readFileSync("dbSettings.json",'utf8'));

var READINTERVAL = appSettings['const']['readInterval'];
var CONSOLIDATEINTERVAL = appSettings['const']['consolidateInterval'];
var TRANSMITINTERVAL = appSettings['const']['transmitInterval'];
var TRANSMITCHUNKSIZE = appSettings['const']['chunkSize'];

var db = dbContext.DataContext(appSettings['db']);
var ser = serialCom.SerialCommunicator(appSettings['serial']['port']);
var server = serverCom.ServerCommunicator(appSettings['server']);

var dataBuffer = new dataHandler.DataBuffer(CONSOLIDATEINTERVAL)

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
    db.getNotTransmittedData().then(function (data) {
        if (data.length > 0) {
            var dataChunk = dataHandler.getDataChunk(data, TRANSMITCHUNKSIZE);
            server.transmit(dataChunk).then(function (response) {
                if (response.response['statusCode'] === 200) {
                    db.markAsTransmitted(response.data);
                }
            })
        }
    })
}

setInterval(ser.requestData, READINTERVAL * 1000)

setInterval(commitData, CONSOLIDATEINTERVAL * 1000)

setInterval(transmitData, TRANSMITINTERVAL * 1000)
// transmitData();