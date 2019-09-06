var serverIP = "localhost:5000";
var equipment = [];
var models = [];
var userData;

function findUser(cardID) {

    json = { "Card ID": cardID };

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            userData = JSON.parse(this.responseText)[0];
            if (!userData["error"]) {
                console.log(userData);

            } else {
                userData = [];
                console.log("Error loading Users");
            }

            document.getElementsByClassName("header_title")[0].innerHTML = `Welcome ${userData["First Name"]}! Choose equipment`;

            loadModels();
        }
    };

    xhr.open('POST', `http://${serverIP}/findUser`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function loadModels() { // Requests to load all the ESP data from the database

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            var data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                console.log(`Loaded ${Object.keys(data).length} Equipment(s) from database`);
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

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            var data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                console.log(`Loaded ${Object.keys(data).length} Equipment(s) from database`);
                equipment = data;
                combineEquipmentData();

                equipment.sort((a, b) => {

                    if (a["precedent"] < b["precedent"]) return -1;
                    if (a["precedent"] > b["precedent"]) return 1;
                    
                    if (a["name"] < b["name"]) return -1;
                    if (a["name"] > b["name"]) return 1;
                    return 0;
                });

            } else {
                data = [];
                console.log("Error loading equipment");
            }
            generateEqupmentTable();
        }
    };

    xhr.open('GET', `http://${serverIP}/load?collection=Equipment_info`, true); // Retrive ESP data
    xhr.send();
}

function combineEquipmentData() {

    for (var i = 0; i < equipment.length; i++) {

        for (var j = 0; j < models.length; j++) {
            if (equipment[i]["model"] == models[j]["name"] ) {
                equipment[i]["precedent"] = models[j]["precedent"];
                break;
            }
        }
    }
}

function generateEqupmentTable() {

    var grid = document.getElementById("equipment_grid");
    for (var i = 0; i < equipment.length; i++) {

        var cell = createElem("DIV", [["class", "equipment_cell"], ["onclick", `sendEquipmentSelectionData("${equipment[i]["id"]}")`]], grid);
        var cellTop = createElem("DIV", [["class", "equipment_cell_top"]], cell);
        var cellImg = createElem("IMG", [["class", "equipment_image"], ["src", loadImage(equipment[i]["model"])]], cellTop);
        var cellBottom = createElem("DIV", [["class", "equipment_cell_bottom"], ["innerHTML", equipment[i]["name"]]], cell);

        if (!userData["Permissions"].includes(equipment[i]["model"])) {
            cell.setAttribute("class", "equipment_cell_unavailable");
            cell.setAttribute("onclick", "");
            cellImg.setAttribute("style", "opacity: 0.5");
            console.log(`No permission for ${equipment[i]["model"]}`);
        } else {
            console.log(`Permission for ${equipment[i]["model"]}`);
        }        
    }
}

function loadImage(model) {

    for (var i = 0; i < models.length; i++) {
        if (models[i]["name"] == model) {
            return models[i]["image"];
        }
    }
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

function sendEquipmentSelectionData(id) {

    var data = {
        card_id: "",
        equipment_id: id
    };

    sessionStorage.equipmentSelectionData = JSON.stringify(data, undefined, 3);
    sessionStorage.equipment = JSON.stringify(equipment, undefined, 3);
    window.location.href = 'http://localhost:5000/testStorage/';
}