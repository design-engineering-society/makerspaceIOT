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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/root.html"));
});

app.get("/operator", (req, res) => {
    res.sendFile(path.join(__dirname + "/operator/operator.html"));
});

app.get("/test", (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Recieved a request from device with IP: ${ip}`);
    res.status(200).send('It Worked ... again!');
});

app.get("/test2", (req, res) => {
    var hosts = ['127.0.0.1','192.168.0.158','192.168.0.110','192.168.0.200','192.168.0.254'];
    var msg = "";
    var count = 0;
    console.log(hosts.length);
    hosts.forEach(function(host){
        ping.sys.probe(host, function(isAlive){
            msg += isAlive ? 'host ' + host + ' is connected<br>' : 'host ' + host + ' is not connected<br>';
            count++;
            if (count == hosts.length) {
                console.log("last message");
                res.status(200).send(msg);
            }
        });
    });
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

app.get("/loadESPs", (req, res) => { // load the current ESP data from database
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Recieved a loadESPs request from device with IP: ${ip}`);

    MongoClient.connect(mongoURL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("makerspace");
        dbo.collection("ESP").find({}).toArray((err, result) => {
            if (err) throw err;
            var resultString = result;
            db.close();
            res.status(200).send(resultString);
        });
    });
});

app.get("/loadESPData", (req, res) => { // load the current ESP data from database

    MongoClient.connect(mongoURL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("makerspace");
        dbo.collection("ESP").find({}).toArray((err, result) => {
            if (err) throw err;
            var IPs = result;
            db.close();
            res.status(200).send(resultString);
        });
    });
});

function checkActiveESPs() {

}

/* Depricated
app.get("/remove", (req, res) => { // remove the current ESP data from database
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Recieved a remove request from device with IP: ${ip}`);

    var removeIP = res.query.IP;

    MongoClient.connect(mongoURL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("makerspace");
        var myquery = { IP: removeIP };
        dbo.collection("ESP").deleteOne(myquery, function(err, obj) {
          if (err) throw err;
          res.status(200).send("1 document deleted");
          db.close();
        });
      });
});
*/

app.get("/addESP", (req, res) => {
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
