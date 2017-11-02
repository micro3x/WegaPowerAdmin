
var fs = require('fs');

var appConfig = require('./appConfig');

var readingsBuffer = require('./models/dataBuffer');

var serialCom = require('./serialCom');
var dataHandler = require('./dataHandler');
var serverCom = require('./serverCom');
var dbContext = require('./dataDB');
var webServer = require('./webServer');


var appSettings = appConfig.getConfig();

var READINTERVAL = appSettings['const']['readInterval'];
var CONSOLIDATEINTERVAL = appSettings['const']['consolidateInterval'];
var TRANSMITINTERVAL = appSettings['const']['transmitInterval'];
var TRANSMITCHUNKSIZE = appSettings['const']['chunkSize'];
var CONFIGUPDATEINTERVAL = appSettings['const']['configUpdateInterval'];

var db = dbContext.DataContext(appSettings['db']);
var ser = serialCom.SerialCommunicator(appSettings['serial']['port']);
var server = serverCom.ServerCommunicator(appSettings['server']);
var frontEnd = webServer.Server();

var dataBuffer = new readingsBuffer.DataBuffer(CONSOLIDATEINTERVAL);


ser.port.on("data", function (data) {

    // todo: handle response from controller when saving configuration data (function is 1, address is corresponding setting)

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

function updateControllerConfig(){
    //todo: 
    // 1. download new config from server
    // 2. get current config
    // 3. compare configs
    // 4. apply if needed
    // 5. send new config to server
}

// uncomment to run
setInterval(ser.requestData, READINTERVAL * 1000)

// setInterval(commitData, CONSOLIDATEINTERVAL * 1000)

// setInterval(transmitData, TRANSMITINTERVAL * 1000)

setInterval(updateControllerConfig, CONFIGUPDATEINTERVAL * 1000)

