const serverIP = "localhost:5000";
var ESPdata;

function loadESPRequest() { // Requests to load all the ESP data from the database

    console.log("loadESPs");
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {

        if (this.status == 200) {
            
            ESPdata = JSON.parse(this.responseText);
            if (!ESPdata["error"]) {
                console.log(ESPdata);
                console.log(`Loaded ${Object.keys(ESPdata).length} ESP(s) from database`);
                
            } else {
                ESPdata = [];
                console.log("No ESPs found");
            }
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

function switchRelay(ESPIP, mode) {

    console.log("switchRelay");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            //switchPlugDisplay(ESPIP, plug, data["plugStatus"]);
            getInfo(ESPIP,"plugs");
        }
    };

    xhr.open('GET', `http://${ESPIP}:80/switchRelay?mode=${mode}`, true);
    xhr.send();
}

function updateESP(IP, description, masterIP, routerIP, plug1Lbl, plug2Lbl, plug3Lbl, plug4Lbl) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {

        if (this.status == 200) {
            var data = this.responseText;
            console.log(data);
            fadeOutPopup();
            loadESPRequest();
            //reloadDisplay();
        }
    };

    xhr.open("POST", `http://${serverIP}/updateESP`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        
        "ID": document.getElementById("ID_label").innerHTML,
        "description": document.getElementById("description_input").value,
        "plug1Lbl": document.getElementById("plug1Lbl_input").value,
        "plug2Lbl": document.getElementById("plug2Lbl_input").value,
        "plug3Lbl": document.getElementById("plug3Lbl_input").value,
        "plug4Lbl": document.getElementById("plug4Lbl_input").value,
        "IP": document.getElementById("IP_input").value,
        "masterIP": document.getElementById("masterIP_input").value,
        "routerIP": document.getElementById("routerIP_input").value
    }));
}

function get(url, loadFunction) {
    console.log("onOff");
    var xhr = new XMLHttpRequest();
    xhr.onload = loadFunction();
    xhr.open('GET', url, true);
    xhr.send();
}