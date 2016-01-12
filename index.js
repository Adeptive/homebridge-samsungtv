var SamsungRemote = require('samsung-remote');
var inherits = require('util').inherits;
var Service, Characteristic, VolumeCharacteristic, ChannelCharacteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    // we can only do this after we receive the homebridge API object
    makeVolumeCharacteristic();
    makeChannelCharacteristic();

    homebridge.registerAccessory("homebridge-samsungtv", "SamsungTV", SamsungTvAccessory);
};

//
// SoundTouch Accessory
//

function SamsungTvAccessory(log, config) {
    this.log = log;
    this.config = config;
    this.name = config["name"];
    this.ip_address = config["ip_address"];

    if (!this.ip_address) throw new Error("You must provide a config value for 'ip_address'.");

    this.remote = new SamsungRemote({
        ip: this.ip_address // required: IP address of your Samsung Smart TV
    });

    this.service = new Service.Switch(this.name);

    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this._getOn.bind(this))
        .on('set', this._setOn.bind(this));

    this.service
        .addCharacteristic(VolumeCharacteristic)
        .on('get', this._getVolume.bind(this))
        .on('set', this._setVolume.bind(this));

    this.service
        .addCharacteristic(ChannelCharacteristic)
        .on('get', this._getChannel.bind(this))
        .on('set', this._setChannel.bind(this));
}

SamsungTvAccessory.prototype.getInformationService = function() {
    var informationService = new Service.AccessoryInformation();
    informationService
        .setCharacteristic(Characteristic.Name, this.name)
        .setCharacteristic(Characteristic.Manufacturer, 'Samsung TV')
        .setCharacteristic(Characteristic.Model, '1.0.0')
        .setCharacteristic(Characteristic.SerialNumber, this.ip_address);
    return informationService;
};

SamsungTvAccessory.prototype.getServices = function() {
    return [this.service, this.getInformationService()];
};

SamsungTvAccessory.prototype._getOn = function(callback) {
    var accessory = this;

    callback(null, true);
};

SamsungTvAccessory.prototype._setOn = function(on, callback) {
    var accessory = this;

    if (on) {
        callback(null);
    } else {
        callback(null);
    }
};

SamsungTvAccessory.prototype._getVolume = function(callback) {
    var accessory = this;

    callback(null, 25);
};

SamsungTvAccessory.prototype._setVolume = function(volume, callback) {
    var accessory = this;

    callback(null);
};


SamsungTvAccessory.prototype._getChannel = function(callback) {
    var accessory = this;

    callback(null, 2);
};

SamsungTvAccessory.prototype._setChannel = function(volume, callback) {
    var accessory = this;

    callback(null);
};

//
// Custom Characteristic for Volume
//
function makeVolumeCharacteristic() {

    VolumeCharacteristic = function() {
        Characteristic.call(this, 'Volume', '91288267-5678-49B2-8D22-F57BE995AA00');
        this.setProps({
            format: Characteristic.Formats.INT,
            unit: Characteristic.Units.PERCENTAGE,
            maxValue: 100,
            minValue: 0,
            minStep: 1,
            perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
        });
        this.value = this.getDefaultValue();
    };

    inherits(VolumeCharacteristic, Characteristic);
}

function makeChannelCharacteristic() {

    ChannelCharacteristic = function () {
        Characteristic.call(this, 'Channel', '212131F4-2E14-4FF4-AE13-C97C3232499D');
        this.setProps({
            format: Characteristic.Formats.INT,
            unit: Characteristic.Units.NONE,
            maxValue: 100,
            minValue: 0,
            minStep: 1,
            perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
        });
        this.value = this.getDefaultValue();
    };

    inherits(ChannelCharacteristic, Characteristic);
}