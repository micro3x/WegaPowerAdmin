var bitwise = require('bitwise');
var crc = require('crc');
var package = require('./models/package');


var transformData = function (dataBuffer) {
    if (!isCrcOK(dataBuffer)) {
        console.log('invalid CRC');
        return;
    }

    // Read Head to determine what to do: 
    var output = { head: 0, func: 0, address: 0, len: 0 };

    var first32 = dataBuffer.slice(0, 4).readUInt32LE(0);
    output.head = first32 & 255;
    output.func = (first32 >> 8) & 255;
    output.address = (first32 >> 16) & 255;
    output.len = first32 >> 24;

    output = new Package(output);

    switch (output.address) {
        case 10: //State
            return transformStatePacket(dataBuffer, output);
        case 11: //WindSettings
            return transformWindSettings(dataBuffer, output);
        case 12: //SolarSettings
            return transformSolarSettings(dataBuffer, output);
        case 13: //OutputSettings
            return transformOutputSettings(dataBuffer, output);
        case 10: //BatterySettings
            return transformBatterySettings(dataBuffer, output);
        default:
            break;
    }
}

function transformStatePacket(dataBuffer, packageHead) {
    var output = new package.StatePack(packageHead);
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

    var now = new Date;
    output.utc_time = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
        now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()) / 1000;
    return output;
}

function transformWindSettings(dataBuffer, packageHead) {
    var output = new package.WindSettings(packageHead);

    var second16 = get10by1(dataBuffer.slice(4, 6));
    output.wMaxV = second16.r1;
    output.wChargeManualEnable = second16.r2;

    var third16 = get10by1(dataBuffer.slice(6, 8));
    output.wMaxA = third16.r1;
    output.wManualBrake = third16.r2;

    var fourth16 = get10by1(dataBuffer.slice(8, 10));
    output.wMaxRpm = fourth16.r1;
    output.wMpptSwitch = fourth16.r2;

    var fifth16 = get10by1(dataBuffer.slice(10, 12));
    output.wStartChargeV = fifth16.r1;

    output.wBrakeTime = dataBuffer.slice(12, 13).readUInt16LE(0);
    output.wMagnetPoleDouble = dataBuffer.slice(13, 14).readUInt16LE(0);

    return output
}

function transformSolarSettings(dataBuffer, packageHead) {
    var output = new package.SolarSettings(packageHead);
    output.onVol = dataBuffer.slice(4, 5).readUInt16LE(0);
    output.offVol = dataBuffer.slice(5, 6).readUInt16LE(0);
    output.manualChargeEnable = dataBuffer.slice(6, 7).readUInt16LE(0);
    return output;
}

function transformOutputSettings(dataBuffer, packageHead) {
    var output = new package.OutputSettings(packageHead);

    var bitsOut1 = dataBuffer.slice(4, 6).readUInt16LE(0);

    output.out1Mode = bitsOut1 & 15;
    output.out1Enable = bitsOut1 & 16 >> 4;
    output.out1TimeDelayOn = bitsOut1 & 992 >> 5;
    output.out1TimeDelayOff = bitsOut1 & 31744 >> 10;

    var bitsOut2 = dataBuffer.slice(6, 8).readUInt16LE(0);

    output.out2Mode = bitsOut2 & 15;
    output.out2Enable = bitsOut2 & 16 >> 4;
    output.out2TimeDelayOn = bitsOut2 & 992 >> 5;
    output.out2TimeDelayOff = bitsOut2 & 31744 >> 10;

}

function transformBatterySettings(dataBuffer, packageHead) {
    var output = new package.BatterySettings(packageHead);
    output.batCapacity = dataBuffer.slice(4, 6).readUInt16LE(0);
    output.lowVPoint = dataBuffer.slice(6, 8).readUInt16LE(0);
    output.lowVRecover = dataBuffer.slice(8, 10).readUInt16LE(0);
    output.overVPoint = dataBuffer.slice(10, 12).readUInt16LE(0);
    output.overVRecover = dataBuffer.slice(12, 14).readUInt16LE(0);
    output.floatChargePoint = dataBuffer.slice(14, 16).readUInt16LE(0);
    output.overVCloseOutput = dataBuffer.slice(16, 18).readUInt16LE(0);
    output.overVRecoverCloseOutput = dataBuffer.slice(18, 20).readUInt16LE(0);
    return output;
}

function get14by2(buffer) {
    var output = {}
    var bits = buffer.readUInt16LE(0);
    output.r1 = bits & 16383;
    output.r2 = (bits & 49152) >> 14;
    return output;
}

function get10by1(buffer) {
    var output = {};
    var bits = buffer.readUInt16LE(0);
    output.r1 = bits & 1023;
    output.r2 = (bits & 1024) >> 10;
    return output;
}

function isCrcOK(buffer) {
    var crcCalc = crc.crc16modbus(buffer.slice(0, (buffer.length - 2)));
    var crcRead = buffer.slice((buffer.length - 2), buffer.length).readUInt16LE(0);
    return (crcCalc === crcRead);
}

var getDataChunks = function (fullData, chunkSize) {
    if (fullData.length > chunkSize) {
        return fullData.slice((chunkSize * -1));
    }
    return fullData;
}

module.exports = {
    transformData: transformData,
    getDataChunks: getDataChunks
    // DataBuffer: DataBuffer
}