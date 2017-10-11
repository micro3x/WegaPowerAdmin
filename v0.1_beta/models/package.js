function Package(obj) {
    this.head = 0;
    this.func = obj.func;
    this.address = obj.address;
    this.len = obj.len;
}

function StatePack(obj) {
    Package.call(this, obj);
    this.batv, this.out1, this.solv, this.out2, this.windv, this.mppt, this.windA, this.outA, this.rpm, this.solA, this.dumpA, this.batCapacity, this.batState, this.dayOrNight, this.nc, this.utc_time = 0;
}

function WindSettings(obj) {
    Package.call(this, obj);
    this.wMaxV = 0;
    this.wChargeManualEnable = 0;
    this.wMaxA = 0;
    this.wManualBrake = 0;
    this.wMaxRpm = 0;
    this.wMpptSwitch = 0;
    this.wStartChargeV = 0;
    this.wBrakeTime = 0;
    this.wMagnetPoleDouble = 0;
}

function SolarSettings(obj) {
    Package.call(this, obj);
    this.onVol = 0;
    this.offVol = 0;
    this.manualChargeEnable = 0;
}

function OutputSettings(obj) {
    Package.call(this, obj);
    this.out1Mode = 0;
    this.out1Enable = 0;
    this.out1TimeDelayOn = 0;
    this.out1TimeDelayOff = 0;
    this.out2Mode = 0;
    this.out2Enable = 0;
    this.out2TimeDelayOn = 0;
    this.out2TimeDelayOff = 0;
}

function BatterySettings(obj) {
    Package.call(this, obj);
    this.batCapacity,
        this.lowVPoint,
        this.lowVRecover,
        this.overVPoint,
        this.overVRecover,
        this.floatChargePoint,
        this.overVCloseOutput,
        this.overVRecoverCloseOutput = 0;
}

module.exports = {
    Package: Package,
    WindSettings: WindSettings,
    SolarSettings: SolarSettings,
    OutputSettings: OutputSettings,
    BatterySettings: BatterySettings,
    StatePack: StatePack
    // DataBuffer: DataBuffer
}