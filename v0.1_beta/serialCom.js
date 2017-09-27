var Serial = require('serialport')

const controllerCommands = {
    getData: Buffer.from([165, 3, 10, 3, 148, 73]),
    getWindSettings: Buffer.from([165, 3, 10, 3, 148, 73])// Todo: Fix this command
};

var SerialCommonicator = function (portname, baudRate = 19200) {
    var port = new Serial(portname, {
        baudRate: baudRate,
        platformOptions : {
            vmin : 1,
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

    return {
        port: port,
        requestData: requestData
    }

}

module.exports = { SerialCommonicator: SerialCommonicator };

