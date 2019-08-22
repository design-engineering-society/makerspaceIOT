/////// REQUESTS ///////

function loadPlugs(mode) { // Requests to load all the ESP data from the database

    //  console.log("loading Plugs");
    if (mode != "background") { setLoadingText("loading"); }

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                console.log(`Loaded ${Object.keys(data).length} Plugs(s) from database`);

            } else {
                data = [];
                console.log("No ESPs found");
            }
            if (mode != "background") { removeLoadingScreen(); }
            refreshTable();
            checkRelays();
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

    var data = findRecord(ID);
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

    var recordData = {
        "ID": document.getElementById("PI_ID").innerHTML,
        "IP": document.getElementById("PI_IP").innerHTML,
        "name": document.getElementById("PI_name").value,
        "ssid": document.getElementById("PI_ssid").value,
        "password": document.getElementById("PI_password").value,
        "masterIP": document.getElementById("PI_masterIP").value
    }

    updateRecord(recordData);
    updateRow(recordData);
    fadeOutPopup();
    console.log(`Updating Plug with IP: ${recordData["IP"]}`);

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

function removeLoadingScreen() {
    popup = document.getElementById("loadingPopup");
    popup.parentNode.removeChild(popup);
}

function setLoadingText(text) {
    loadingText = document.getElementById("loadingText");
    loadingText.innerHTML = text;
}

function createPopupLbl(P_grid, data) {

    var P_label = createElem("DIV", [["class", "P_label NS"], ["innerHTML", data[0]]], P_grid);
    if (data[1] == "DIV") {
        var P_data = createElem("DIV", [["class", "P_label"], ["id", data[3]], ["innerHTML", data[2]], ["style", "text-align:left; font-size: 0.9rem;"]], P_grid);
    } else if (data[1] == "INPUT") {
        var P_data_wrap = createElem("DIV", [["class", "P_input_wrap"]], P_grid);
        var P_data = createElem("INPUT", [["class", "P_input"], ["id", data[3]], ["value", data[2]]], P_data_wrap);
    }
}

function addPopup(id) {

    let popupData = findRecord(id);

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_grid = createElem("DIV", [["id", "P_grid"]], P_panel);
    const P_title = createElem("DIV", [["id", "P_title"], ["innerHTML", "Edit Plug Config"], ["class", "NS"]], P_grid);

    createPopupLbl(P_grid, ["ID:", "DIV", popupData["ID"], "PI_ID"]);
    createPopupLbl(P_grid, ["IP:", "DIV", popupData["IP"], "PI_IP"]);
    createPopupLbl(P_grid, ["Name:", "INPUT", popupData["name"], "PI_name"]);
    createPopupLbl(P_grid, ["SSID:", "INPUT", popupData["ssid"], "PI_ssid"]);
    createPopupLbl(P_grid, ["Password:", "INPUT", popupData["password"], "PI_password"]);
    createPopupLbl(P_grid, ["Master IP:", "INPUT", popupData["masterIP"], "PI_masterIP"]);

    const P_update_wrap = createElem("DIV", [["id", "P_update_wrap"]], P_grid);
    const P_update = createElem("BUTTON", [["id", "P_update"], ["innerHTML", "Update"], ["onclick", "updatePlug()"]], P_update_wrap);

    fadeInPopup(P_wrapper);
}