const express = require('express');
const request = require('request');
const bodyParser = require("body-parser"); // For parsing data in POST request
const path = require('path');
const ping = require('ping');
const app = express();// creates an instance of express. it is like the swrver object

function connect(req, res) {
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var ID = req.body["ID"];

    console.log(req.body);
    console.log(`Recieved a connect request from device with IP: ${ip} and ID: ${ID}`);
    res.status(200).send(`Connect request recieved from IP: ${ip} and ID: ${ID}`);
}