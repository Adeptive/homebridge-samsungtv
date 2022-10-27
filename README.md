# Homebridge-samsung_tv

Samsung TV plugin for [Homebridge](https://github.com/nfarina/homebridge)

Branched from https://github.com/CONNCTED/homebridge-samsungtv

This allows you to control your Samsung TV with HomeKit and Siri.

## Installation
1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-samsung_tv
3. Update your configuration file. See the sample below.

## Configuration
You can use the Configuration UI from Homebridge

Fields: 

* "name": The name you want to use to control the TV.
* "ip_address": The internal ip address of your samsung TV
* "intervall": in seconds the interval of checking the alive state
* "disableLogging": activate or deactivate the logging of the plugin
