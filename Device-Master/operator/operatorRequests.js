const serverIP = "localhost:5000";
var ESPdata;

function loadESPRequest() { // Requests to load all the ESP data from the database

    console.log("loadESPs");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {
            ESPdata = JSON.parse(this.responseText);
            console.log(ESPdata);
            console.log(`Loaded ${Object.keys(ESPdata).length} ESP(s) from database`);
            
            reloadDisplay();
        }
    };

    xhr.open('GET', `http://${serverIP}/loadESPData`, true); // Retrive ESP data
    xhr.send();
}

function getInfo(ESPIP,mode) { // Retrieve various forms of info from ESP

    console.log("getting info");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);

            if (mode == "plugs") {
                changePlugColours(ESPIP, data["plugs"]); // TODO remove eventually. Need to change background colour of child divs
            }
        }
    };
    xhr.open('GET', `http://${ESPIP}:80/info?mode=${mode}`, true);
    xhr.send();
}

function onOff(ESPIP, plug) {

    console.log("onOff");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            switchPlugDisplay(ESPIP, plug, data["plugStatus"]);
            getInfo(ESPIP,"plugs");
        }
    };

    xhr.open('GET', `http://${ESPIP}:80/onOff?plug=${plug}`, true);
    xhr.send();
}

function updateESP(ESPIP) {

    console.log("updating");

    var description = document.getElementById("description_input").value;
    var plug1Lbl = document.getElementById("plug1Lbl_input").value;
    var plug2Lbl = document.getElementById("plug2Lbl_input").value;
    var plug3Lbl = document.getElementById("plug3Lbl_input").value;
    var plug4Lbl = document.getElementById("plug4Lbl_input").value;
    var IP = document.getElementById("IP_input").value;
    var masterIP = document.getElementById("masterIP_input").value;
    var routerIP = document.getElementById("routerIP_input").value;

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            updateESPinDB(IP, description, masterIP, routerIP, plug1Lbl, plug2Lbl, plug3Lbl, plug4Lbl);
        }
    };
    xhr.open("POST", `http://${ESPIP}:80/update`, true);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.send(JSON.stringify({
        "IP": IP,
        "description": description,
        "masterIP": masterIP,
        "routerIP": routerIP,
        "plug1Lbl": plug1Lbl,
        "plug2Lbl": plug2Lbl,
        "plug3Lbl": plug3Lbl,
        "plug4Lbl": plug4Lbl
    }));
}

function updateESPinDB(IP, description, masterIP, routerIP, plug1Lbl, plug2Lbl, plug3Lbl, plug4Lbl) {

    console.log("updating in database");

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {
            var data = this.responseText;
            console.log(data);
            fadeOutPopup();
            reloadDisplay();
        }
    };
    xhr.open("POST", `http://${serverIP}/updateESPinDB`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "IP": IP,
        "description": description,
        "masterIP": masterIP,
        "routerIP": routerIP,
        "plug1Lbl": plug1Lbl,
        "plug2Lbl": plug2Lbl,
        "plug3Lbl": plug3Lbl,
        "plug4Lbl": plug4Lbl
    }));
}