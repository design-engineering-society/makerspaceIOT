const express = require('express');
const request = require('request');
const bodyParser = require("body-parser"); // For parsing data in POST request
const path = require('path');
const ping = require('ping');
const app = express();// creates an instance of express. it is like the swrver object
const dbUtil = require('./dbUtil.js');

const MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/";
var ESPDoc;

const routerIP = "192.168.0.254";
const masterIP = "192.168.0.110"; //ip of josh laptop    

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


app.post("/connect", (req, res) => { 
    var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).replace("::ffff:","");
    var ID = req.body["ID"];

    dbUtil.find("ESP", {"ID": ID}, dbres => {
        if (dbres.length == 0) {
            console.log("ID not found. Adding to database");
            dbUtil.add("ESP", {"ID": ID}, dbres => {});
        } else {
            console.log(dbres);
        }
        console.log(`Recieved a connect request from device with IP: ${ip} and ID: ${ID}`);
        res.status(200).send(`Connect request recieved from IP: ${ip} and ID: ${ID}`);
    });
});

app.get("/registerCard", (req, res) => { 

    var cardID = req.query["cardid"];
    var firstname = req.query["firstname"];
    var lastname = req.query["familyname"];

    console.log(req.query);

    var dbquery = {"cardid": cardID};
    var userDetails = {"firstname": firstname, "lastname": lastname};

    dbUtil.upsert("Users", dbquery, userDetails, dbres => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).send(`User '${firstname} ${lastname}' registered`);
    });
});

app.get("/authenticateCard", (req, res) => { 

    var cardID = req.query["cardid"];

    console.log(req.query);

    dbUtil.find("Users", {"cardid": cardid}, dbres => {
        msg = (dbres.length == 0) ? "false" : true;
        console.log(msg);
        res.status(200).send(msg);
    });
});

app.get("/addTimestamp", (req, res) => { 

    var requestData = req.query;

    console.log(requestData);

    dbUtil.add("Timestamp", requestData, () => {
        console.log(`Timestamp added`);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).send(`Timestamp added`);
    });
});

app.post("/updateESPinDB", (req, res) => {

    console.log(req.body);

    const obj = {
        IP: req.body["IP"],
        description: req.body["description"],
        masterIP: req.body["masterIP"],
        routerIP: req.body["routerIP"],
        plug1Lbl: req.body["plug1Lbl"],
        plug2Lbl: req.body["plug2Lbl"],
        plug3Lbl: req.body["plug3Lbl"],
        plug4Lbl: req.body["plug4Lbl"]
    };

    dbUtil.upsert("ESP", {IP: IP}, obj, dbres => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).send("1 document updated");
    });
});

app.get("/loadESPData", (req, res) => { // load the ESP data from database. TODO - neaten this logic up

    dbUtil.find("ESP", {}, dbres => {
        
        var msg = "";
        var count = 0;
        var resultArray = [];

        dbres.forEach((IPEntry) => { // Check which ESPs are currently connected
            ping.sys.probe(IPEntry["IP"], (isAlive) => {

                if (isAlive) {
                    resultArray.push(IPEntry);
                }
                count++;

                if (count == dbres.length) { // If the last ESP has been checked
                    if (resultArray.length != 0) {

                        var ipIndexedResultArray = IPIndexESPData(resultArray);
                        res.status(200).send(ipIndexedResultArray);
                    } else {
                        res.status(200).send("No ESPs found");
                    }
                }
            });
        });
    });
});

function IPIndexESPData(data) { // TODO: Don't need this - need to change how the database entries are structured 

    var ipIndexedData = {};

    data.forEach((entry) => {
        var ip = entry["IP"];
        delete entry["IP"];
        delete entry["_id"];
        ipIndexedData[ip] = entry;
    });

    return ipIndexedData;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));//sets us, starts the server
