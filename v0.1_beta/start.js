
var fs = require('fs');

var readingsBuffer = require('./models/dataBuffer');

var serialCom = require('./serialCom');
var dataHandler = require('./dataHandler');
var serverCom = require('./serverCom');
var dbContext = require('./dataDB');
var webServer = require('./webServer');


var appSettings = JSON.parse(fs.readFileSync("appSettings.json", 'utf8'));

var READINTERVAL = appSettings['const']['readInterval'];
var CONSOLIDATEINTERVAL = appSettings['const']['consolidateInterval'];
var TRANSMITINTERVAL = appSettings['const']['transmitInterval'];
var TRANSMITCHUNKSIZE = appSettings['const']['chunkSize'];

var db = dbContext.DataContext(appSettings['db']);
var ser = serialCom.SerialCommunicator(appSettings['serial']['port']);
var server = serverCom.ServerCommunicator(appSettings['server']);

var dataBuffer = new readingsBuffer.DataBuffer(CONSOLIDATEINTERVAL);


ser.port.on("data", function (data) {
    var dataReceived = dataHandler.transformData(data);

    if (dataReceived && dataReceived.func == 4) {
        switch (dataReceived.address) { // check package type
            case 10: // State Packet
                dataBuffer.add(dataReceived);
                break;
            case 11: // WindSettings
                db.saveCurrentSettings(dataReceived);
                break;
            case 12: //SolarSettings
                db.saveCurrentSettings(dataReceived);
                break;
            case 13: // OutputSettings
                db.saveCurrentSettings(dataReceived);
                break;
            case 14: // BatterySettings
                db.saveCurrentSettings(dataReceived);
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

// uncomment to run
setInterval(ser.requestData, READINTERVAL * 1000)

setInterval(commitData, CONSOLIDATEINTERVAL * 1000)

setInterval(transmitData, TRANSMITINTERVAL * 1000)

var frontEnd = webServer.Server();