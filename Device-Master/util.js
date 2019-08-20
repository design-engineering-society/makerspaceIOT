const express = require('express');
const request = require('request');
const bodyParser = require("body-parser"); // For parsing data in POST request
const dbUtil = require('./dbUtil.js');
const path = require('path');
const ping = require('ping');
const app = express();// creates an instance of express. it is like the swrver object

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ssid = "TP-Link_6F62";
const password = "78059757";
const masterIP = "192.168.0.110"; //ip of josh laptop

module.exports = {
    
    newESP: function(id, ip) {

        json = {
            ID: id,
            name: "-",
            operating_mode: "normal",
            IP: ip,
            ssid: ssid,
            password: password,
            masterIP: masterIP
        };
    
        return json
    },

    get: function(url, loadFunction) {
        console.log("onOff");
        var xhr = new XMLHttpRequest();
        xhr.onload = loadFunction();
        xhr.open('GET', url, true);
        xhr.send();
    }
}