var SamsungRemote = require('samsung-remote');
var inherits = require('util').inherits;
var Service, Characteristic, VolumeCharacteristic, ChannelCharacteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

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

}

SamsungTvAccessory.prototype.getInformationService = function () {
    var informationService = new Service.AccessoryInformation();
    informationService
        .setCharacteristic(Characteristic.Name, this.name)
        .setCharacteristic(Characteristic.Manufacturer, 'Samsung TV')
        .setCharacteristic(Characteristic.Model, '1.0.0')
        .setCharacteristic(Characteristic.SerialNumber, this.ip_address);
    return informationService;
};

SamsungTvAccessory.prototype.getServices = function () {
    return [this.service, this.getInformationService()];
};

SamsungTvAccessory.prototype._getOn = function (callback) {
    var accessory = this;
    this.remote.isAlive(function (err) {
        if (err) {
            accessory.log('TV is offline');
            callback(null, false)
        } else {
            accessory.log('TV is On');
            callback(null, true);
        }
    });
};

SamsungTvAccessory.prototype._setOn = function (on, callback) {
    if (on) {
        callback(null, false);
    } else {
        this.remote.send('KEY_POWEROFF', function (err) {
            if (err) {
                callback(new Error(err));
            } else {
                // command has been successfully transmitted to your tv
                callback(null);
            }
        });
    }
};
