const express = require('express');
const request = require('request');
const bodyParser = require("body-parser"); // For parsing data in POST request
const path = require('path');
const ping = require('ping');
const app = express(); // creates an instance of express. it is like the swrver object
const dbUtil = require('./dbUtil.js');
const util = require('./util.js');

const routerIP = "192.168.0.254";
const masterIP = "192.168.0.110"; //ip of josh laptop
const ssid = "TP-Link_6F62";
const password = "78059757";

const MongoClient = require('mongodb').MongoClient;
var mongoURL = `mongodb://${masterIP}:27017/`;
var ESPDoc;


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

app.get("/plugs", (req, res) => { // Loads the operator page
    res.sendFile(path.join(__dirname + "/Plugs/Plugs.html"));
});

app.get("/users", (req, res) => { // Loads the operator page
    res.sendFile(path.join(__dirname + "/Users/Users.html"));
});


app.post("/connect", (req, res) => {
    var IP = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).replace("::ffff:", "");
    var ID = req.body["ID"];

    dbUtil.find("Plugs", { "ID": ID }, dbres => {
        if (dbres.length == 0) {
            console.log("ID not found. Adding Plug to database");
            dbUtil.add("Plugs", util.newESP(ID, IP), dbres => { });
        } else {
            if (dbres[0]["IP"] != IP) {
                dbUtil.update("Plugs", { "ID": ID }, { "IP": IP }, dbres => {
                    console.log("Plug's IP changed. Updating IP in database");
                });
            }
        }
        console.log(`Recieved a connect request from device with IP: ${IP} and ID: ${ID}`);
        sendCORS(res, 200, "Connected");
    });
});

app.get("/registerCard", (req, res) => {

    var cardID = req.query["cardid"];
    var firstname = req.query["firstname"];
    var lastname = req.query["familyname"];

    console.log(req.query);

    var dbquery = { "cardid": cardID };
    var userDetails = { "firstname": firstname, "lastname": lastname };

    dbUtil.upsert("Users", dbquery, userDetails, dbres => {
        sendCORS(res, 200, `User '${firstname} ${lastname}' registered`);
    });
});

app.get("/authenticateCard", (req, res) => {

    var cardID = req.query["cardid"];

    console.log(req.query);

    dbUtil.find("Users", { "cardid": cardid }, dbres => {
        msg = (dbres.length == 0) ? "false" : true;
        console.log(msg);
        sendCORS(res, 200, msg);
    });
});

app.get("/addTimestamp", (req, res) => {

    var requestData = req.query;

    console.log(requestData);

    dbUtil.add("Timestamp", requestData, () => {
        console.log(`Timestamp added`);
        sendCORS(res, 200, "Timestamp added");
    });
});

app.post("/updatePlug", (req, res) => {

    var id = req.body["ID"];

    const obj = {
        name: req.body["name"],
        ssid: req.body["ssid"],
        password: req.body["password"],
        masterIP: req.body["masterIP"]
    };

    dbUtil.update("Plugs", { "ID": id }, obj, dbres => {

        obj["ID"] = id;
        obj["IP"] = req.body["IP"];
        updatePlugConfig(obj);

        sendCORS(res, 200, "1 document updated");
    });
});

function updatePlugConfig(data) {

    console.log(`Updating Config in Plug with IP: ${data["IP"]}`);

    request.post(`http://${data["IP"]}:80/update`, { json: data }, (error, res, body) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(`statusCode: ${res.statusCode}`);
        console.log(body);
    })
}

app.get("/addUser", (req, res) => {

    const obj = {
        "Card ID": "3456876399",
        "CID": "04346633",
        "Username": "India",
        "First Name": "Hardik",
        "Last Name": "Aggarwal",
        "Department": "Electronic and Information Engineering",
        "Program": "MEng",
        "Description": "",
        "Study Date Start": "October 2017",
        "Study Date End": "June 2021",
        "Study Year": "3",
        "Role": "Rep",
        "Equipment Type Access": "...",
        "Credit": "-50000.00",
        "Date User Inducted": "01/02/1993",
        "Remarks": "India"
    };

    dbUtil.add("Users", obj, dbres => {
        sendCORS(res, 200, "1 document updated");
    });
});

app.get("/loadUsers", (req, res) => {

    dbUtil.find("Users", {}, dbres => {
        console.log(dbres);
        sendCORS(res, 200, dbres);
    });
});

app.get("/loadPlugs", (req, res) => { // load the ESP data from database

    dbUtil.find("Plugs", {}, dbres => {

        var msg = "";
        var count = 0;
        var resultArray = [];

        dbres.forEach((IPEntry) => { // Check which ESPs are currently connected
            ping.sys.probe(IPEntry["IP"], (isAlive) => {
                if (isAlive) {
                    IPEntry["WiFiStatus"] = "online";
                    IPEntry["relay"] = "...";
                } else {
                    IPEntry["WiFiStatus"] = "offline";
                    IPEntry["relay"] = "Na";
                }
                resultArray.push(IPEntry);
                count++;

                if (count == dbres.length) { // If the last ESP has been checked
                    if (resultArray.length != 0) {

                        resultArray.sort((a, b) => {

                            if (a["name"] < b["name"]) return -1;
                            if (a["name"] > b["name"]) return 1;
                            return 0;
                        });
                        sendCORS(res, 200, JSON.stringify(resultArray, undefined, 3));
                    } else {
                        sendCORS(res, 200, "{\"error\": \"no Plugs found\"}");
                    }
                }
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

function sendCORS(res, code, message) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(code).send(message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));//sets us, starts the server
