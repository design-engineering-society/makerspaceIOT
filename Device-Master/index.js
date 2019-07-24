const express = require('express');
const request = require('request');
const path = require('path');
const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/root.html"));
});

app.get("/test", (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Recieved a request from device with IP: ${ip}`);
    res.status(200).send('It Worked ... again!');
});

app.get("/init", (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Recieved an init request from device with IP: ${ip}`);
    res.status(200).send('Init request recieved');
});

app.get("/reconnect", (req, res) => { 
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Recieved a reconnect request from device with IP: ${ip}`);
    res.status(200).send('Reconnect request recieved');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
