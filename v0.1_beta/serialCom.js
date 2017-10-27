var Serial = require('serialport');
var dataHandler = require('./dataHandler');

const controllerCommands = {
    getData: Buffer.from([165, 3, 10, 3, 148, 73]),
    getWindSettings: Buffer.from([165, 3, 11, 3, 149, 217]),
    getSolarSettings: Buffer.from([165, 3, 12, 3, 151, 233]),
    getOutputSettings: Buffer.from([165, 3, 13, 3, 150, 121]),
    getBatterySettings: Buffer.from([165, 3, 14, 3, 150, 137])

};

var SerialCommunicator = function (portname, baudRate = 19200) {
    var port = new Serial(portname, {
        baudRate: baudRate,
        platformOptions: {
            vmin: 1,
            vtime: 0
        }
    })

    function logError(err) {
        if (err) {
            console.log(err)
        }
    }

    function requestData() {
        if (port.isOpen) {
            port.write(controllerCommands.getData, logError);
        }
    }

    function requestConfig() {
        if (port.isOpen) {
            port.write(controllerCommands.getWindSettings);
            setTimeout(port.write(controllerCommands.getSolarSettings), 100);
            setTimeout(port.write(controllerCommands.getOutputSettings), 100);
            setTimeout(port.write(controllerCommands.getBatterySettings), 100);
        }
    }

    function applyConfig(newConfig) {
        //todo: controller config split in different types
        // use data handler to transform in Buffer
        // transfer via serial port.
    }

    return {
        port: port,
        requestData: requestData,
        requestConfig: requestConfig
    }

}

module.exports = { SerialCommunicator: SerialCommunicator };

