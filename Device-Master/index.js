// --- IMPORTING MODULES AND DEFINING GLOBAL VARIABLES/CONSTANTS --- ///
const express = require('express'); // Express Framework
const request = require('request'); // sending and hadling HTTP/HTTPS requests
const bodyParser = require("body-parser"); // Parses data in POST request
const path = require('path'); // Paths / directories
const ping = require('ping'); // Generates ping requests 
const app = express(); // creates an instance of express. it is like the swrver object
const dbUtil = require('./dbUtil.js'); // Utility functions for the database 
const util = require('./util.js'); // Utility functions for general stuff

const routerIP = "192.168.0.254";
const masterIP = "192.168.0.160"; //ip of michaels mac
const ssid = "TP-Link_6F62";
const password = "78059757";

const MongoClient = require('mongodb').MongoClient; // Creates a new Mongodb client instance, which is used throughout
var ESPDoc; // Variable for storing data about an ESP (this may be deletable)

// --- ESTABLISHING MIDDLEWARE --- //
app.use(express.static(__dirname)); // use / as root directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bo

// --- ROUTING REQUESTS TO FUNCTIONS --- //
app.get("/yeet", (req, res) => { res.sendFile(path.join(__dirname + "/root.html")); });
app.get("/operator", (req, res) => { res.sendFile(path.join(__dirname + "/operator/operator.html")); });
app.get("/plugs", (req, res) => { res.sendFile(path.join(__dirname + "/Plugs/Plugs.html")); });
app.get("/users", (req, res) => { res.sendFile(path.join(__dirname + "/Users/Users.html")); });
app.get("/equipment", (req, res) => { res.sendFile(path.join(__dirname + "/Equipment/Equipment.html")); });
app.get("/welcome", (req, res) => { res.sendFile(path.join(__dirname + "/User_UI/choose_equipment.html")); });
app.get("/testStorage", (req, res) => { res.sendFile(path.join(__dirname + "/User_UI/test_storage.html")); });

// Tells the Master Device that an ESP has connected an updates the database with data for the connected ESP //
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

// Registers a user by updating user_info in the database //
app.get("/registerCard", (req, res) => {

    var cardID = req.query["cardid"];
    var firstname = req.query["firstname"];
    var lastname = req.query["familyname"];

    console.log(req.query);

    var dbquery = { "cardid": cardID };
    var userDetails = { "firstname": firstname, "lastname": lastname };

    dbUtil.upsertExt("User_Info", dbquery, userDetails, dbres => {
        sendCORS(res, 200, `User '${firstname} ${lastname}' registered`);
    });
});

// Checks if a card is registered in the database //
app.get("/authenticateCard", (req, res) => {

    var cardID = req.query["cardid"];

    console.log(req.query);

    dbUtil.findExt("User_Info", { "cardid": cardid }, dbres => {
        msg = (dbres.length == 0) ? "false" : true;
        console.log(msg);
        sendCORS(res, 200, msg);
    });
});

// Adds a timestamp to the database //
app.get("/addTimestamp", (req, res) => {

    var requestData = req.query;

    console.log(requestData);

    dbUtil.add("Timestamp", requestData, () => {
        console.log(`Timestamp added`);
        sendCORS(res, 200, "Timestamp added");
    });
});

// Updates information about a given plug in the database //
app.post("/updatePlug", (req, res) => {

    var id = req.body["ID"];

    const obj = {
        equipment_name: req.body["equipment_name"],
        equipment_id: req.body["equipment_id"],
        ssid: req.body["ssid"],
        password: req.body["password"],
        masterIP: req.body["masterIP"]
    };

    dbUtil.updateExt("Plug_info", { "ID": id }, obj, dbres => {

        obj["ID"] = id;
        obj["IP"] = req.body["IP"];
        updatePlugConfig(obj);

        sendCORS(res, 200, "1 document updated");
    });
});

// Sends a request to an ESP to update the config file //
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

// Adds a user to the database //
app.post("/addUser", (req, res) => {

    const obj = {
        "First Name": req.body["First Name"],
        "Last Name": req.body["Last Name"],
        "Email": req.body["Email"],
        "Card ID": req.body["Card ID"],
        "CID": req.body["CID"],
        "Role": req.body["Role"],
        "Credit": Number(req.body["Credit"]),
        "Permissions": req.body["Permissions"]
    };

    dbUtil.addExt("User_info", obj, dbres => {
        dbUtil.findExt("User_info", {}, dbres => {
            sendCORS(res, 200, dbres);
        });
    });
});

// Edits a users information in the database //
app.post("/editUser", (req, res) => {

    //console.log(req.body["Card ID"]);

    const query = { "Card ID": req.body["Card ID"] }
    const obj = {
        "First Name": req.body["First Name"],
        "Last Name": req.body["Last Name"],
        "Email": req.body["Email"],
        "CID": req.body["CID"],
        "Role": req.body["Role"],
        "Credit": Number(req.body["Credit"]),
        "Permissions": req.body["Permissions"]
    };

    dbUtil.updateExt("User_info", query, obj, (dbres) => {
        console.log(dbres);
        dbUtil.findExt("User_info", {}, dbres => {
            sendCORS(res, 200, dbres);
        });
    });
});

// Returns a filtered list of user information based on a filterd input //
app.post("/filterUsers", (req, res) => {

    query = {};

    for (var queryItem in req.body) {

        if (req.body[queryItem] == "") { continue; }

        query[queryItem] = { $regex: `.*${req.body[queryItem]}.*`, $options: 'i' };
    }

    console.log(query);

    dbUtil.findExt("User_info", query, dbres => {
        sendCORS(res, 200, dbres);
    });
});

// Removes users based on a filterd input //
app.post("/removeUsers", (req, res) => { // DANGEROUS

    query = {};

    for (var queryItem in req.body) {

        if (req.body[queryItem] == "") { continue; }

        query[queryItem] = { $regex: `.*${req.body[queryItem]}.*`, $options: 'i' };
    }

    console.log(query);

    if (query != {}) {
        dbUtil.deleteExt("User_info", query, dbres => {
            dbUtil.findExt("User_info", {}, dbres => {
                sendCORS(res, 200, dbres);
            });
        });
    }
});

// Adds credit to users based on a filterd input //
app.post("/addCreditToUsers", (req, res) => {

    query = {};

    for (var queryItem in req.body) {

        if (queryItem != "Credit") {
            if (req.body[queryItem] == "") { continue; }
            query[queryItem] = { $regex: `.*${req.body[queryItem]}.*`, $options: 'i' };
        }
    }

    dbUtil.incExt("User_info", query, { "Credit": Number(req.body["Credit"]) }, dbres => {
        dbUtil.findExt("User_info", {}, dbres => {
            sendCORS(res, 200, dbres);
        });
    });
});

// Returns a list of information on all users in the database //
app.get("/loadUsers", (req, res) => {

    console.log("loading users");

    dbUtil.findExt("User_info", {}, dbres => {
        console.log(dbres);
        sendCORS(res, 200, dbres);
    });
});

// Returns a user from the database based on their card id //
app.post("/findUser", (req, res) => {

    cardID = req.body["Card ID"]; // req.query works n hardiks laptop

    console.log(`finding user with card ID: ${cardID}`);

    dbUtil.findExt("User_info", { "Card ID": cardID }, dbres => {
        sendCORS(res, 200, dbres);
    });
});

// Utility function to ceate a new collection (table) in the database //
app.get("/createCollection", (req, res) => {

    dbUtil.createExt("Model_info", () => {
        console.log("Created collection");
        sendCORS(res, 200, "Created collection");
    });
});

// Utility function to add info an arbitrary collection //
app.get("/addTo", (req, res) => {

    var obj = {
        ID: "b7a53b47-7fa7-428e-a9f7-72c4819a7083",
        equipment_name: "-",
        equipment_id: "-",
        operating_mode: "normal",
        status: "available",
        IP: "192.168.0.106",
        ssid: "TP-Link_6F62",
        password: "78059757",
        masterIP: "192.168.0.110"
    };

    dbUtil.addExt("Plug_info", obj, (dbres) => {

        sendCORS(res, 200, dbres);
    });
});

// Utility function to delete a record based on a query //
app.get("/deleteFrom", (req, res) => {

    var query = { "CID": "88483210" };

    dbUtil.deleteExt("Plug_info", {}, (dbres) => {
        console.log(dbres);
        sendCORS(res, 200, dbres);
    });
});

// Utility function to update a record based on a query //
app.get("/updateRecord", (req, res) => {

    var query = { "IP": "192.168.0.133" };
    var obj = { "ID": "58e9aa3d-9bcf-484f-ab56-f205ce9da5ff" };

    dbUtil.updateExt("Plug_info", query, obj, (dbres) => {
        console.log(dbres);
        sendCORS(res, 200, dbres);
    });
});

// Loads from a specified collection //
app.get("/load", (req, res) => {

    var collection = req.query["collection"];

    dbUtil.findExt(collection, {}, dbres => {
        //console.log(dbres);
        sendCORS(res, 200, dbres);
    });
});

// (Defunct) //
app.get("/loadEquipment", (req, res) => {

    // var collection = req.query["collection"];

    // dbUtil.findExt(collection, {}, dbres => {
    //     //console.log(dbres);
    //     sendCORS(res, 200, dbres);
    // });

    console.log("hello world");
});

// Loads the status and information about all plugs by sending a request to all plugs on the database //
app.get("/loadPlugs", (req, res) => { // load the ESP data from database

    dbUtil.findExt("Plug_info", {}, dbres => {

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

                            if (a["equipment_name"] < b["equipment_name"]) return -1;
                            if (a["equipment_name"] > b["equipment_name"]) return 1;

                            if (a["ID"] < b["ID"]) return -1;
                            if (a["ID"] > b["ID"]) return 1;
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

app.get("/testDB", (req, res) => {

    dbUtil.find2(dbres => {
        console.log(dbres);
        sendCORS(res, 200, dbres);
    });
});

// Reshuffles a record from the database into a more readable format //
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

// Utility function to send a CORS message for authentication //
function sendCORS(res, code, message) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(code).send(message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));//sets us, starts the server
