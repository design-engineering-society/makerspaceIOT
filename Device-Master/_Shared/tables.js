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
    Users: {
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

function checkPlugsPeriodic() {
    setInterval(() => {
        loadPlugs("background");
    }, 10000);
};

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
    loadPlugs("initial");
    checkPlugsPeriodic();
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
            } else if (headers[j] == "Relay") {
                createCell("toggle", i, headers[j], DG_body_row);
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
    var DG_body_cell = createElem("button", [["class", "DG_body_edit P"], ["onclick", `addPopup("${id}")`]], DG_body_row);
    var DG_edit_img = createElem("IMG", [["class", "DG_edit_img NS"], ["src", "../_Shared/options.svg"]], DG_body_cell);

    return DG_body_row;
}

function createCell(type, i, header, row) {

    var DG_body_cell;

    if (type == "DIV") {
        DG_body_cell = createElem("DIV", [["class", "DG_body_cell"], ["id", `${data[i]["ID"]} | ${header}`]], "");
    } else if (type == "toggle") {
        DG_body_cell = createElem("DIV", [["class", "DG_body_cell_btn NS P"], ["id", `${data[i]["ID"]} | ${header}`], ["onclick", `toggle("${data[i]["ID"]}", "${data[i]["IP"]}")`]], "");
    } else if (type == "button") {
        DG_body_cell = createElem("DIV", [["class", "DG_body_cell_btn NS P"], ["id", `${data[i]["ID"]} | ${header}`], ["onclick", `blink("${data[i]["ID"]}", "${data[i]["IP"]}")`]], "");
    }
    row.appendChild(DG_body_cell);
}

function updateTable(type) {

    if (type == "Plugs") {
        for (var i = 0; i < data.length; i++) {
            updateCell(data[i]["ID"], "Name", elem => { elem.innerHTML = data[i]["name"] });
            updateCell(data[i]["ID"], "UUID", elem => { elem.innerHTML = data[i]["ID"] });
            updateCell(data[i]["ID"], "IP", elem => { elem.innerHTML = data[i]["IP"] });
            updateCell(data[i]["ID"], "WiFi Status", elem => {

                if (data[i]["WiFiStatus"] == "online") {
                    elem.setAttribute("style", "background-color: #82ff64");
                } else if (data[i]["WiFiStatus"] == "offline") {
                    elem.setAttribute("style", "background-color: #ff6464");
                }
                elem.innerHTML = data[i]["WiFiStatus"]
            }
            );
            updateCell(data[i]["ID"], "Relay", elem => { updateRelayCell(data[i], elem); });
        }
    }
}

function updateCell(ID, header, func) {
    elem = document.getElementById(`${ID} | ${header}`);
    func(elem);
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