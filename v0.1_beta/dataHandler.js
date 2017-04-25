var bitwise = require('bitwise');
var crc = require('crc')

var transformData = function (dataBuffer) {
    if (!isCrcOK(dataBuffer)) {
        console.log('invalid CRC');
        return;
    }

    //todo: in this scenario I handle only state packets...
    // this func should handle all kinds of pakets.
    var output = {
        head: 0, func: 0, address: 0, len: 0, batv: 0, out1: 0, solv: 0, out2: 0, windv: 0, mppt: 0,
        windA: 0, outA: 0, rpm: 0, solA: 0, dumpA: 0, batCapacity: 0, batState: 0, dayOrNight: 0, nc: 0,
        utc_time: 0
    }

    var first32 = dataBuffer.slice(0, 4).readUInt32LE(0);
    output.head = first32 & 255;
    output.func = (first32 >> 8) & 255;
    output.address = (first32 >> 16) & 255;
    output.len = first32 >> 24;

    var second16 = get14by2(dataBuffer.slice(4, 6));
    output.batv = second16.r1;
    output.out1 = second16.r2;

    var tirth16 = get14by2(dataBuffer.slice(6, 8));
    output.solv = tirth16.r1;
    output.out2 = tirth16.r2;

    var forth16 = get14by2(dataBuffer.slice(8, 10));
    output.windv = forth16.r1;
    output.mppt = forth16.r2;

    var fifth32 = dataBuffer.slice(10, 14).readUInt32LE(0);
    output.windA = fifth32 & 1023;
    output.outA = (fifth32 >> 10) & 1023;
    output.rpm = fifth32 >> 20;

    var sixt32 = dataBuffer.slice(14, 18).readUInt32LE(0);
    output.solA = sixt32 & 1023;
    output.dumpA = (sixt32 >> 10) & 1023;
    output.batCapacity = (sixt32 >> 20) & 127;
    output.batState = (sixt32 >> 27) & 7;
    output.dayOrNight = (sixt32 >> 30) & 1;
    // output.nc = (sixt32 >> 31) & 1;

    var now = new Date;
    output.utc_time = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
        now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()) / 1000;

    return output;
}

function transformStatePacket(dataBuffer) {

}

function get14by2(buffer) {
    var output = {}
    var bits = buffer.readUInt16LE(0);
    output.r1 = bits & 16383;
    output.r2 = (bits & 49152) >> 14;
    return output;
}

function isCrcOK(buffer) {
    var crcCalc = crc.crc16modbus(buffer.slice(0, (buffer.length - 2)));
    var crcRead = buffer.slice((buffer.length - 2), buffer.length).readUInt16LE(0);
    return (crcCalc === crcRead);
}

// function avgReadings(dataArray) {
//     var counter = 0;
//     var result = {};

//     dataArray.forEach(function (dataElement) {
//         for (var key in dataElement) {
//             if (dataElement.hasOwnProperty(key)) {
//                 if (!result[key]) {
//                     result[key] = 0;
//                 }
//                 result[key] += dataElement[key];
//             }
//         }
//         counter += 1;
//     }, this);

//     for (var resultKey in result) {
//         if (result.hasOwnProperty(resultKey)) {
//             result[resultKey] = Math.floor(result[resultKey] / counter);
//         }
//     }
//     return result;
// }

var DataBuffer = function (interval = 60) {
    var container = [];

    this.add = function (data) {
        container.push(data);
    }

    this.flush = function () {
        container = [];
    }

    this.clean = function () {
        var maxTime = this.newestData();
        var tempContainer = [];
        container.forEach(function (element) {
            if (element[utc_time] > (maxTime - interval)) {
                tempContainer.push(element);
            }
        }, this);
        container = tempContainer;
    }

    this.oldestData = function () {
        if (container.length < 1) {
            return false;
        }
        container.sort(function (a, b) {
            return (a['utc_time'] - b['utc_time']);
        });
        return container[0];
    }

    this.newestData = function () {
        if (container.length < 1) {
            return false;
        }
        container.sort(function (a, b) {
            return (a['utc_time'] - b['utc_time']);
        });
        return container[container.length - 1];
    }

    this.consolidate = function () {
        var max = this.newestData();
        var min = this.oldestData();
        if ((max - min) > interval) {
            this.clean();
        }

        var counter = 0;
        var result = {};

        container.forEach(function (dataElement) {
            for (var key in dataElement) {
                if (dataElement.hasOwnProperty(key)) {
                    if (!result[key]) {
                        result[key] = 0;
                    }
                    result[key] += dataElement[key];
                }
            }
            counter += 1;
        }, this);

        for (var resultKey in result) {
            if (result.hasOwnProperty(resultKey)) {
                result[resultKey] = Math.floor(result[resultKey] / counter);
            }
        }
        var now = new Date;
        result['utc_time'] = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
            now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()) / 1000;
        this.flush();
        return result;
    }

}

module.exports = {
    transformData: transformData,
    DataBuffer: DataBuffer
}