const express = require('express');
const request = require('request');
const bodyParser = require("body-parser"); // For parsing data in POST request
const path = require('path');
const ping = require('ping');
const app = express();// creates an instance of express. it is like the swrver object

const MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/";
var ESPDoc;

const routerIP = "192.168.0.254";
const masterIP = "192.168.0.110";//ip of josh laptop

app.use(express.static(__dirname)); // use / as root directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bo

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

    MongoClient.connect(mongoURL, { useNewUrlParser: true }, function(err, db) {
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
          res.status(200).send('Init request recieved');
        });
    });
});

app.get("/reconnect", (req, res) => { 
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Recieved a reconnect request from device with IP: ${ip}`);
    res.status(200).send('Reconnect request recieved');
});

app.get("/registerCard", (req, res) => { 

    var cardID = req.query["cardid"];
    var firstname = req.query["firstname"];
    var lastname = req.query["familyname"];

    console.log(req.query);

    MongoClient.connect(mongoURL, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;

        var dbo = db.db("makerspace");
        var dbquery = {"cardid": cardID};
        var userDetails = {$set: {"firstname": firstname, "lastname": lastname}};
        dbo.collection("Users").updateOne(dbquery, userDetails, {upsert: true}, function(err, dbres) {
            if (err) throw err;
            console.log(`User '${firstname} ${lastname}' registered`);
            db.close();
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.status(200).send(`User '${firstname} ${lastname}' registered`);
        });
    });
});

app.get("/authenticateCard", (req, res) => { 

    var cardID = req.query["cardid"];

    console.log(req.query);

    MongoClient.connect(mongoURL, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;

        var dbo = db.db("makerspace");
        var DBquery = {"cardid": cardID};
        dbo.collection("Users").find(DBquery).toArray(function(err, dbres) {
            if (err) throw err;
            //console.log(dbres);
            var msg;
            if (dbres.length == 0) {
                msg = "false";
            } else {
                msg = "true";
            }
            
            db.close();
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.status(200).send(msg);
            console.log(msg);
        });
    });
});

app.get("/addTimestamp", (req, res) => { 

    var requestData = req.query;

    console.log(requestData);

    MongoClient.connect(mongoURL, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;

        var dbo = db.db("makerspace");
        dbo.collection("Timestamp").insertOne(requestData, function(err, dbres) {
            if (err) throw err;
            console.log(`Timestamp added`);
            db.close();
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.status(200).send(`Timestamp added`);
        });
    });
});

app.post("/updateESPinDB", (req, res) => {

    console.log(req.body);

    var IP = req.body["IP"];
    var description = req.body["description"];
    var masterIP = req.body["masterIP"];
    var routerIP = req.body["routerIP"];
    var plug1Lbl = req.body["plug1Lbl"];
    var plug2Lbl = req.body["plug2Lbl"];
    var plug3Lbl = req.body["plug3Lbl"];
    var plug4Lbl = req.body["plug4Lbl"];

    console.log(`IP: ${IP}`);

    MongoClient.connect(mongoURL, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("makerspace");
        var myquery = { IP: IP };
        var newvalues = { $set: {IP: IP, description: description, masterIP: masterIP, routerIP: routerIP, plug1Lbl: plug1Lbl, plug2Lbl: plug2Lbl, plug3Lbl: plug3Lbl, plug4Lbl: plug4Lbl } };
        dbo.collection("ESP").updateOne(myquery, newvalues, function(err, resDB) {
          if (err) throw err;
          db.close();
          res.status(200).send("1 document updated");
        });
      });
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
        var myobj = {"IP":"192.168.0.190","description":"3D Printer Rack 2","masterIP":"192.168.9.110","routerIP":"192.168.0.254","plug1Lbl":"3D Printer 5","plug2Lbl":"3D Printer 6","plug3Lbl":"3D Printer 7","plug4Lbl":"3D Printer 8"};
        dbo.collection("ESP").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));//sets us, starts the server
