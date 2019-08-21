var data = [
    {
        "ID": "f874bfea-3f7e-42a7-89c8-e05aa8dfd5ab",
        "name": "Prusa A3",
        "operating_mode": "normal",
        "IP": "192.168.0.167",
        "ssid": "Makerspace WiFi",
        "password": "sadsdfgdsdfddsg",
        "masterIP": "192.168.0.110"
    },
    {
        "ID": "fe1e9b3c-200f-476e-b596-d4461944524c",
        "name": "Prusa A4",
        "operating_mode": "normal",
        "IP": "192.168.0.168",
        "ssid": "Makerspace WiFi",
        "password": "sadsdfgdsdfddsg",
        "masterIP": "192.168.0.110"
    },
    {
        "ID": "735cc473-7e2f-4a70-bd27-c3cd776f56ae",
        "name": "Prusa A5",
        "operating_mode": "normal",
        "IP": "192.168.0.82",
        "ssid": "Makerspace WiFi",
        "password": "sadsdfgdsdfddsg",
        "masterIP": "192.168.0.110"
    },
    {
        "ID": "3f60eec2-2e93-480c-a1c9-fbd55ee8a23a",
        "name": "Prusa A6",
        "operating_mode": "normal",
        "IP": "192.168.0.152",
        "ssid": "Makerspace WiFi",
        "password": "sadsdfgdsdfddsg",
        "masterIP": "192.168.0.110"
    }
];

tables = {
    Plugs: {
        attributes: [
            ["Name", "200px"],
            ["UUID", "370px"],
            ["IP", "200px"],
            ["Status", "200px"],
            ["Relay (Debug)", "200px"],
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
    xhr.onload = function() {

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
    xhr.onload = function() {

        if (this.status == 200) {
            
            console.log(this.responseText);
        }
    };

    xhr.open('GET', `http://${ESPIP}:80/blink?repeat=1&duration=1`, true);
    xhr.send();
}

function createElem(type, attributes) {
    var elem = document.createElement(type);
    for (var atr = 0; atr < attributes.length; atr++) {
        elem.setAttribute(attributes[atr][0], attributes[atr][1]);
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

    DG_container = createElem("DIV", [["class", "DG_container"]]);
    document.getElementsByClassName("title")[0].innerHTML = DG.getAttribute("type");

    // Header
    var DG_header = createElem("DIV", [["class", "DG_header"], ["style", gridTemplateColumns]]);
    var DG_header_cell = createElem("DIV", [["class", "DG_header_cell"]]);
    DG_header.appendChild(DG_header_cell);

    for (const header of headers) {

        DG_header_cell = createElem("DIV", [["class", "DG_header_cell"]]);
        DG_header_cell.innerHTML = header;
        DG_header.appendChild(DG_header_cell);
    }

    DG_container.appendChild(DG_header);

    var DG_body = createElem("DIV", [["class", "DG_body"]]);

    DG_container.appendChild(DG_body);
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
        var DG_body_row = initRow();

        for (var j = 0; j < headers.length; j++) { // Create Cells for each rows
            if (headers[j] == "Blink") {
                createCell("button", i, j, DG_body_row);
            } else {
                createCell("DIV", i, j, DG_body_row);
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

function initRow() {
    var DG_body_row = createElem("DIV", [["class", "DG_body_row"], ["style", gridTemplateColumns]]);
    var DG_body_cell = createElem("DIV", [["class", "DG_body_cell"]]);
    DG_body_row.appendChild(DG_body_cell);
    var DG_edit_img = createElem("IMG", [["class", "DG_edit_img NS"], ["src", "options.svg"]]);
    DG_body_cell.appendChild(DG_edit_img);

    return DG_body_row;
}

function createCell(type, i, j, row) {

    var DG_body_cell;

    if (type == "DIV") {
        DG_body_cell = createElem("DIV", [["class", "DG_body_cell"], ["id", `${data[i]["ID"]} | ${j}`]]);
    } else if (type == "button") {
        DG_body_cell = createElem("button", [["class", "DG_body_cell_btn"], ["id", `${data[i]["ID"]} | ${j}`], ["onclick", `blink("${data[i]["IP"]}")`]]);
    }
    row.appendChild(DG_body_cell);
}

function updateTable(type) {

    if (type == "Plugs") {
        for (var i = 0; i < data.length; i++) {
            updateText(i, "0", data[i]["name"]);
            updateText(i, "1", data[i]["ID"]);
            updateText(i, "2", data[i]["IP"]);
        }
    }
}

function updateText(itr, id, text) {
    elem = document.getElementById(`${data[itr]["ID"]} | ${id}`);
    elem.innerHTML = text;
}

function removeLoadingScreen() {
    popup = document.getElementById("loadingPopup");
    popup.parentNode.removeChild(popup);
}

function setLoadingText(text) {
    loadingText = document.getElementById("loadingText");
    loadingText.innerHTML = text;
}