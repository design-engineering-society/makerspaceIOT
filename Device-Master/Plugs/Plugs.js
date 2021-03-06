var equipment;
var availableEquipment = [];
var empty = [null, ""];

/////// REQUESTS ///////

function loadModels() { // Requests to load all the ESP data from the database

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            var data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                console.log(`Loaded ${Object.keys(data).length} Models(s) from database`);
                models = data;
            } else {
                data = [];
                console.log("Error loading models");
            }
            loadEquipment();
        }
    };

    xhr.open('GET', `http://${serverIP}/load?collection=Model_info`, true); // Retrive ESP data
    xhr.send();
}

function loadEquipment() { // Requests to load all the ESP data from the database

    availableEquipment = [];

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            equipment = JSON.parse(this.responseText);
            if (!equipment["error"]) {
                console.log(equipment);
                console.log(`Loaded ${Object.keys(equipment).length} Equipment(s) from database`);

                combineEquipmentData();

                equipment.sort((a, b) => {

                    if (a["precedent"] < b["precedent"]) return -1;
                    if (a["precedent"] > b["precedent"]) return 1;

                    if (a["name"] < b["name"]) return -1;
                    if (a["name"] > b["name"]) return 1;
                    return 0;
                });

            } else {
                equipment = [];
                console.log("Error loading equipment");
            }

            for (var i = 0; i < equipment.length; i++) {

                var available = true;

                for (var j = 0; j < data.length; j++) {
                    if (equipment[i]["id"] == data[j]["equipment_id"]) { // if a plug has an equipment id, that equipment is not available
                        available = false;
                        break;
                    }
                }

                if (available) {
                    availableEquipment.push(equipment[i]);
                }
            }
            console.log(availableEquipment);
            console.log("available ^");

            refreshTable("Plugs");
            checkRelays();
        }
    };

    xhr.open('GET', `http://${serverIP}/load?collection=Equipment_info`, true); // Retrive ESP data
    xhr.send();
}

function combineEquipmentData() {

    for (var i = 0; i < equipment.length; i++) {

        for (var j = 0; j < models.length; j++) {
            if (equipment[i]["model"] == models[j]["name"]) {
                equipment[i]["precedent"] = models[j]["precedent"];
                break;
            }
        }
    }
}

function loadPlugs(mode) { // Requests to load all the ESP data from the database

    //  console.log("loading Plugs");
    if (mode != "background") { setLoadingText("Loading plug data"); }

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                console.log(`Loaded ${Object.keys(data).length} Plugs(s) from database`);

            } else {
                data = [];
                console.log("Error loading Plugs");
            }
            if (mode != "background") { removeLoadingScreen(); }
            loadModels();
        }
    };

    xhr.open('GET', `http://${serverIP}/loadPlugs`, true); // Retrive ESP data
    xhr.send();
}

function blink(ID, IP) {

    elem = document.getElementById(`${ID} | WiFi Status`);
    if (elem.innerHTML == "offline") {
        console.log("Plug currently unavailable to blink");
        return;
    }

    console.log(`blinking Plug with IP: ${IP}`);

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            console.log(this.responseText);
        }
    };

    xhr.open('GET', `http://${IP}:80/blink?repeat=1&duration=1`, true);
    xhr.send();
}

function toggle(ID, IP) {

    elem = document.getElementById(`${ID} | Relay`);
    if (elem.innerHTML == "Na" || elem.innerHTML == "checking" || elem.innerHTML == "...") {
        console.log("Relay currently unavailable to toggle");
        return;
    }

    console.log(`Togglig relay on plug with IP: ${IP}`);

    var data = findRecord(ID, "ID");
    data["relay"] = "...";
    updateCell(ID, "Relay", elem => { updateRelayCell(data, elem); });

    var xhr = new XMLHttpRequest();  // TODO
    xhr.onload = function () {

        if (this.status == 200) {

            data["relay"] = JSON.parse(this.responseText)["Relay"];

            updateCell(ID, "Relay", elem => { updateRelayCell(data, elem); });
        }
    };

    xhr.open('GET', `http://${IP}:80/switchRelay?mode=toggle`, true);
    xhr.send();
}

function checkRelays() {

    //console.log(`Checking relays`);

    for (let i = 0; i < data.length; i++) {

        if (data[i]["WiFiStatus"] == "offline") {
            continue;
        }

        var xhr = new XMLHttpRequest();
        xhr.onload = function () {

            if (this.status == 200) {

                data[i]["relay"] = JSON.parse(this.responseText)["relay"];

                updateCell(data[i]["ID"], "Relay", elem => { updateRelayCell(data[i], elem); });
            }
        };

        xhr.open('GET', `http://${data[i]["IP"]}:80/info?mode=relay`, true);
        xhr.send();
    }
}

function updatePlug() {

    var equipmentSelected = findEquipmentWithName(document.getElementById("PI_equipment").value)

    var recordData = {
        "ID": document.getElementById("PI_ID").innerHTML,
        "IP": document.getElementById("PI_IP").innerHTML,
        "equipment_id": equipmentSelected["id"],
        "equipment_name": equipmentSelected["name"],
        "ssid": document.getElementById("PI_ssid").value,
        "password": document.getElementById("PI_password").value,
        "masterIP": document.getElementById("PI_masterIP").value
    }

    console.log(recordData);

    updateRecord(recordData);
    updateRow(recordData);
    fadeOutPopup();
    //console.log(`Updating Plug with IP: ${recordData["IP"]}`);

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            console.log(this.responseText);
        }
    };

    xhr.open('POST', `http://${serverIP}/updatePlug`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(recordData));
}


///// Plug Table
function Plugs_loadFunction() {
    loadPlugs();
    checkPlugsPeriodic();
}

function updateRelayCell(data, elem) {
    if (data["relay"] == "checking" || data["relay"] == "...") {
        elem.setAttribute("style", "background-color: #ffec1f");
    } else if (data["relay"] == "ON") {
        elem.setAttribute("style", "background-color: #82ff64");
    } else if (data["relay"] == "OFF") {
        elem.setAttribute("style", "background-color: #fcba03");
    } else if (data["relay"] == "Na") {
        elem.setAttribute("style", "background-color: #ff6464");
    }
    elem.innerHTML = data["relay"];
}

function addPopup_E(id) {

    let popupData = findRecord(id, "ID");

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_grid = createElem("DIV", [["id", "P_grid"]], P_panel);
    const P_title = createElem("DIV", [["id", "P_title"], ["innerHTML", "Edit Plug Config"], ["class", "NS"]], P_grid);

    createPopupLbl(P_grid, ["ID:", "DIV", popupData["ID"], "PI_ID"]);
    createPopupLbl(P_grid, ["IP:", "DIV", popupData["IP"], "PI_IP"]);
    createPopupLbl(P_grid, ["Equipment:", "SELECT", popupData["equipment_name"], "PI_equipment", AEText(popupData)]);
    createPopupLbl(P_grid, ["SSID:", "INPUT", popupData["ssid"], "PI_ssid"]);
    createPopupLbl(P_grid, ["Password:", "INPUT", popupData["password"], "PI_password"]);
    createPopupLbl(P_grid, ["Master IP:", "INPUT", popupData["masterIP"], "PI_masterIP"]);

    const P_update_wrap = createElem("DIV", [["id", "P_update_wrap"]], P_grid);
    const P_update = createElem("BUTTON", [["id", "P_update"], ["innerHTML", "Update"], ["onclick", "updatePlug()"]], P_update_wrap);

    fadeInPopup(P_wrapper);
}

function AEText(popupData) {

    var str = [popupData["equipment_name"]];

    for (var i = 0; i < availableEquipment.length; i++) {
        if (popupData["equipment_name"] == availableEquipment[i]["name"]) {
            str.push(`/s/ ${availableEquipment[i]["name"]}`);
        } else {
            str.push(availableEquipment[i]["name"]);
        }
    }
    return str;
}

function findEquipmentWithName(name) {

    for (var i = 0; i < availableEquipment.length; i++) {
        
        if (availableEquipment[i]["name"] == name) {
            return availableEquipment[i];
        }
    }
}

function checkPlugsPeriodic() {
    setInterval(() => {
        loadPlugs("background");
    }, 10000);
};