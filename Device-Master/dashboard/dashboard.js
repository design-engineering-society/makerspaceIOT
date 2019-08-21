tables = {
    Plugs: {
        attributes: [
            ["Name", "200px"],
            ["UUID", "370px"],
            ["IP", "200px"],
            ["WiFi Status", "200px"],
            ["Relay", "200px"],
            ["Blink", "100px"]
        ]
    },
    Test: {
        attributes: [
            ["Name", "200px"],
            ["Equipment", "370px"],
            ["Start Time", "200px"],
            ["End Time", "200px"]
        ]
    }
};

const serverIP = "localhost:5000";

var data;
var DG; // Dashboard Grid
var DG_container; // Dashboard Grid Container
var type; // Type of Table e.g. Plugs - used for debugging
var info; // All relavent information on the table
var headers = []; // Array of header text
var gridTemplateColumns = "grid-template-columns: 50px " // Layout of table

function loadPlugs() { // Requests to load all the ESP data from the database

    console.log("loading Plugs");
    setLoadingText("loading");

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                console.log(`Loaded ${Object.keys(data).length} ESP(s) from database`);

            } else {
                data = [];
                console.log("No ESPs found");
            }
            removeLoadingScreen();
            refreshTable();
        }
    };

    xhr.open('GET', `http://${serverIP}/loadPlugs`, true); // Retrive ESP data
    xhr.send();
}

function blink(ESPIP) {

    console.log(`blinking Plug with IP: ${ESPIP}`);

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            console.log(this.responseText);
        }
    };

    xhr.open('GET', `http://${ESPIP}:80/blink?repeat=1&duration=1`, true);
    xhr.send();
}

function checkRelays() {

    console.log(`Checking relays`);

    for (let i = 0; i < data.length; i++) {

        var xhr = new XMLHttpRequest();
        xhr.onload = function () {

            if (this.status == 200) {

                console.log(this.responseText);

                data[i]["relay"] = this.responseText;

                updateCell(i, "Relay", elem => {

                    if (data[i]["relay"] == "checking") {
                        elem.setAttribute("style", "background-color: #76ffdb");
                    } else if (data[i]["relay"] == "ON") {
                        elem.setAttribute("style", "background-color: #82ff64");
                    } else if (data[i]["relay"] == "OFF") {
                        elem.setAttribute("style", "background-color: #ff6464");
                    }
                    elem.innerHTML = data[i]["relay"];
                });
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

function createElem(type, attributes, parent) {
    var elem = document.createElement(type);
    for (var atr = 0; atr < attributes.length; atr++) {
        if (attributes[atr][0] == "innerHTML") {
            elem.innerHTML = attributes[atr][1];
        } else if (attributes[atr][0] == "value") {
            elem.value = attributes[atr][1];
        } else {
            elem.setAttribute(attributes[atr][0], attributes[atr][1]);
        }
    }
    if (parent == "body") {
        document.body.appendChild(elem);
    } else if (parent != "") {
        parent.appendChild(elem);
    }
    return elem
}

function generateTable() {

    // Initialise
    DG = document.getElementById("DG");
    type = DG.getAttribute("type");
    info = tables[type];

    for (var i = 0; i < info["attributes"].length; i++) {
        headers.push(info["attributes"][i][0]);
        gridTemplateColumns += (info["attributes"][i][1] + " ");
    }

    DG_container = createElem("DIV", [["class", "DG_container"]], "");
    document.getElementsByClassName("title")[0].innerHTML = DG.getAttribute("type");

    // Header
    var DG_header = createElem("DIV", [["class", "DG_header"], ["style", gridTemplateColumns]], "");
    var DG_header_cell = createElem("DIV", [["class", "DG_header_cell"]], DG_header);

    for (const header of headers) {
        DG_header_cell = createElem("DIV", [["class", "DG_header_cell"], ["innerHTML", header]], DG_header);
    }

    DG_container.appendChild(DG_header);

    var DG_body = createElem("DIV", [["class", "DG_body"]], DG_container);

    DG.appendChild(DG_container);
    document.getElementsByClassName("wrapper")[0].appendChild(DG);
    loadPlugs();
}

function refreshTable() {

    var DG_body = resetBody();
    if (data == []) {
        return;
    }

    for (var i = 0; i < data.length; i++) { // Create Rows
        var DG_body_row = initRow(data[i]["ID"]);

        for (var j = 0; j < headers.length; j++) { // Create Cells for each rows
            if (headers[j] == "Blink") {
                createCell("button", i, headers[j], DG_body_row);
            } else {
                createCell("DIV", i, headers[j], DG_body_row);
            }
        }
        DG_body.appendChild(DG_body_row);
    }
    DG.appendChild(DG_container);
    updateTable(type);
}

function resetBody() {
    var DG_body = document.getElementsByClassName("DG_body")[0];
    while (DG_body.firstChild) {
        DG_body.removeChild(DG_body.firstChild);
    }
    return DG_body;
}

function initRow(id) {
    var DG_body_row = createElem("DIV", [["class", "DG_body_row"], ["style", gridTemplateColumns]], "");
    var DG_body_cell = createElem("button", [["class", "DG_body_edit"], ["onclick", `addPopup("${id}")`]], DG_body_row);
    var DG_edit_img = createElem("IMG", [["class", "DG_edit_img NS"], ["src", "options.svg"]], DG_body_cell);

    return DG_body_row;
}

function createCell(type, i, header, row) {

    var DG_body_cell;

    if (type == "DIV") {
        DG_body_cell = createElem("DIV", [["class", "DG_body_cell"], ["id", `${data[i]["ID"]} | ${header}`]], "");
    } else if (type == "button") {
        DG_body_cell = createElem("button", [["class", "DG_body_cell_btn"], ["id", `${data[i]["ID"]} | ${header}`], ["onclick", `blink("${data[i]["IP"]}")`]], "");
    }
    row.appendChild(DG_body_cell);
}

function updateTable(type) {

    if (type == "Plugs") {
        for (var i = 0; i < data.length; i++) {
            updateCell(i, "Name", elem => { elem.innerHTML = data[i]["name"] });
            updateCell(i, "UUID", elem => { elem.innerHTML = data[i]["ID"] });
            updateCell(i, "IP", elem => { elem.innerHTML = data[i]["IP"] });
            updateCell(i, "WiFi Status", elem => {

                if (data[i]["WiFiStatus"] == "online") {
                    elem.setAttribute("style", "background-color: #82ff64");
                } else if (data[i]["WiFiStatus"] == "offline") {
                    elem.setAttribute("style", "background-color: #ff6464");
                }
                elem.innerHTML = data[i]["WiFiStatus"]
            }
            );
            updateCell(i, "Relay", elem => {

                if (data[i]["relay"] == "checking") {
                    elem.setAttribute("style", "background-color: #76ffdb");
                } else if (data[i]["relay"] == "ON") {
                    elem.setAttribute("style", "background-color: #82ff64");
                } else if (data[i]["relay"] == "OFF") {
                    elem.setAttribute("style", "background-color: #ff6464");
                }
                elem.innerHTML = data[i]["relay"]
            }
            );
        }
    }
}

function updateCell(itr, header, func) {
    elem = document.getElementById(`${data[itr]["ID"]} | ${header}`);
    func(elem);
}

function removeLoadingScreen() {
    popup = document.getElementById("loadingPopup");
    popup.parentNode.removeChild(popup);
}

function setLoadingText(text) {
    loadingText = document.getElementById("loadingText");
    loadingText.innerHTML = text;
}

function testing() {
    console.log("testing");
}

//////////////////////////////////// POPUP

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

function fadeOutPopup() {
    var element = document.getElementById("P_wrapper");

    var op = 1;
    var inc = 0.08;
    var timer = setInterval(function () {
        if (op <= 0) {
            element.parentNode.removeChild(element);
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= inc;
    }, 8);
}

function fadeInPopup(element) {
    var op = 0;
    var inc = 0.08;
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += inc;
    }, 8);
}

function findRecord(id) {

    for (let i = 0; i < data.length; i++) {
        if (data[i]["ID"] == id) {
            return data[i];
        }
    }
    return [];
}

function updateRecord(recordData) {

    for (let i = 0; i < data.length; i++) {
        if (data[i]["ID"] == recordData["ID"]) {
            data[i]["name"] = recordData["name"];
            data[i]["ssid"] = recordData["ssid"];
            data[i]["password"] = recordData["password"];
            data[i]["masterIP"] = recordData["masterIP"];
            return;
        }
    }
}

function updateRow(recordData) {

    console.log(recordData);
    document.getElementById(`${recordData["ID"]} | Name`).innerHTML = recordData["name"];
}