const express = require('express');
const request = require('request');
const bodyParser = require("body-parser"); // For parsing data in POST request
const path = require('path');
const ping = require('ping');
const app = express();

const MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/";
var ESPDoc;

const routerIP = "192.168.0.254";
const masterIP = "192.168.0.110";

app.use(express.static(__dirname)); // use / as root directory
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/yeet", (req, res) => { // Loads the root or 'index' page
    res.sendFile(path.join(__dirname + "/root.html"));
});

app.get("/operator", (req, res) => { // Loads the operator page
    res.sendFile(path.join(__dirname + "/operator/operator.html"));
});

app.get("/init", (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Recieved an init request from device with IP: ${ip}`);

    var initIP = res.query.IP;

    // TODO: Ideally, check if the same IP exists. If it does, then call an overlapping IP error

    MongoClient.connect(mongoURL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("makerspace");
        var myobj = 
        {
            IP: initIP,
            description: "-",
            masterIP: masterIP,
            routerIP: routerIP,
            plug1Lbl: "-",
            plug2Lbl: "-",
            plug3Lbl: "-",
            plug4Lbl: "-"
        };
    
        dbo.collection("ESP").insertOne(myobj, (err, res) => {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
    });

    res.status(200).send('Init request recieved');
});

app.get("/reconnect", (req, res) => { 
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Recieved a reconnect request from device with IP: ${ip}`);
    res.status(200).send('Reconnect request recieved');
});

app.get("/card", (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var msg = `Retrived card request from ${ip}`;
    console.log(msg);
    console.log(req.params);
    res.status(200).send(msg);
});

app.get("/loadESPData", (req, res) => { // load the ESP data from database. TODO - neaten this logic up

    MongoClient.connect(mongoURL, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("makerspace");
        dbo.collection("ESP").find({}).toArray((err, result) => {
            if (err) throw err;
            var allESPData = result; // Collect ALL ESP Data
            db.close();

            var msg = "";
            var count = 0;
            var resultArray = [];

            allESPData.forEach((IPEntry) => { // Check which ESPs are currently connected
                ping.sys.probe(IPEntry["IP"], (isAlive) => {

                    if (isAlive) {
                        resultArray.push(IPEntry);
                    }
                    count++;

                    if (count == allESPData.length) { // If the last ESP has been checked
                        if (resultArray.length != 0) {

                            var ipIndexedResultArray = IPIndexESPData(resultArray);
                            res.status(200).send(ipIndexedResultArray);
                        } else {
                            res.status(400).send("No ESPs found");
                        }
                    }
                });
            });
        });
    });
});

function IPIndexESPData(data) {

    var ipIndexedData = {};

    data.forEach((entry) => {
        var ip = entry["IP"];
        delete entry["IP"];
        delete entry["_id"];
        ipIndexedData[ip] = entry;
    });

    return ipIndexedData;
}

app.get("/addESPtoDB", (req, res) => {
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("makerspace");
        var myobj = {"IP":"192.168.0.190","description":"3D Printer Rack 2","masterIP":"192.168.9.110","routerIP":"192.168.0.254","plug1Lbl":"3D Printer 5","plug2Lbl":"3D Printer 6","plug3Lbl":"3D Printer 7","plug4Lbl":"3D Printer 8"};        dbo.collection("ESP").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
