#Homebridge-samsungtv

Samsung TV plugin for [Homebridge](https://github.com/nfarina/homebridge)

This allows you to control your Samsung TV with HomeKit and Siri.

##Installation
1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-samsungtv
3. Update your configuration file. See the sample below.

##Configuration
Example config.json:

```
    "accessories": [
		{
			"accessory": "SamsungTV",
			"name": "TV Living room",
			"ip_address": "192.168.1.2"
		}
	],
```

Fields: 

* "accessory": Must always be "SamsungTV" (required)
* "name": The name you want to use to control the TV.
* "ip_address": The internal ip address of your samsung TV