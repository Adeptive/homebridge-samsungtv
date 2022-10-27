var SamsungRemote = require('samsung-remote');
var inherits = require('util').inherits;
var Service, Characteristic, VolumeCharacteristic, ChannelCharacteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-samsung_tv", "SamsungTV", SamsungTvAccessory);
};

function SamsungTvAccessory(log, config) {
    this.log = log;
    this.name = config.name;
    this.ip_address = config.ip_address;
    this.intervall = config.intervall;
    this.disableLogging = config.disableLogging;

    if (!this.ip_address) throw new Error("You must provide a config value for 'ip_address'.");

    this.remote = new SamsungRemote({
        ip: this.ip_address // required: IP address of your Samsung Smart TV
    });

    this.service = new Service.Switch(this.name);

    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this._getOn.bind(this))
        .on('set', this._setOn.bind(this));

    this.updateInterval = setInterval(() => {

            this.remote.isAlive((err) => {
                if (err) {
                    this.service.updateCharacteristic(Characteristic.On, false);
                    if( ! this.disableLogging ) {
                        this.log(this.name + ' is offline');
                    }
    
                } else {
                    this.service.updateCharacteristic(Characteristic.On, true);
                    if( ! this.disableLogging ) {
                        this.log(this.name + ' is ALIVE!');
                    }
                }
            });


        }, this.intervall * 1000);

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
            callback(null, false)
        } else {
            callback(null, true);
        }
    });
};

SamsungTvAccessory.prototype._setOn = function (on, callback) {
    var accessory = this;
    
    if (on) {
        callback(null, false);
    } else {
        this.remote.send('KEY_POWEROFF', function (result) {
            if( ! this.disableLogging ) {
                accessory.log(result);
            }
        }.bind(accessory));
        callback(null,false);
    }
};
