var plugs;
var models;

function Equipment_loadFunction() {
    loadPlugs();
}

function loadPlugs() { // Requests to load all the ESP data from the database

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            plugs = JSON.parse(this.responseText);
            if (!plugs["error"]) {
                console.log(plugs);
                console.log(`Loaded ${Object.keys(plugs).length} Plug(s) from database`);
                models = data;
            } else {
                plugs = [];
                console.log("Error loading plugs");
            }
            loadModels();
        }
    };

    xhr.open('GET', `http://${serverIP}/load?collection=Plug_info`, true); // Retrive ESP data
    xhr.send();
}

function loadModels() { // Requests to load all the ESP data from the database

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            models = JSON.parse(this.responseText);
            if (!models["error"]) {
                console.log(models);
                console.log(`Loaded ${Object.keys(models).length} Model(s) from database`);
                models.sort((a, b) => {

                    if (a["precedent"] < b["precedent"]) return -1;
                    if (a["precedent"] > b["precedent"]) return 1;
                    return 0;
                });

            } else {
                models = [];
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

            data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                console.log(`Loaded ${Object.keys(data).length} Equipment(s) from database`);

                combineEquipmentData();

                data.sort((a, b) => {

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
            refreshTable("Equipment");
            removeLoadingScreen();
        }
    };

    xhr.open('GET', `http://${serverIP}/load?collection=Equipment_info`, true); // Retrive ESP data
    xhr.send();
}

function combineEquipmentData() {

    for (var i = 0; i < data.length; i++) {

        for (var j = 0; j < models.length; j++) {
            if (data[i]["model"] == models[j]["name"]) {
                data[i]["precedent"] = models[j]["precedent"];
                break;
            }
        }
    }
}

function addPopupE_AE() {

    userPermissions = [];

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_title = createElem("DIV", [["id", "P_AU_title"], ["innerHTML", "Add Equipment"], ["class", "NS"]], P_panel);

    const P_grid_info = createElem("DIV", [["id", "P_AU_grid_info"]], P_panel);
    createPopupLbl_AE(P_grid_info, ["Name:", "INPUT", "", "AE_Name"]);
    createPopupLbl_AE(P_grid_info, ["Model:", "SELECT", "", "AE_Model", ["/s/  Prusa", "Ultimaker", "Markforged", "Formlabs", "Lasercutter", "Vinylcutter", "Roland CNC", "Stepcraft CNC"]]);

    const P_add_wrap = createElem("DIV", [["id", "P_AU_update_wrap"]], P_panel);
    const P_add = createElem("BUTTON", [["id", "P_AU_update"], ["class", "P"], ["innerHTML", "Add"], ["onclick", "addEditUser('add')"]], P_add_wrap);

    fadeInPopup(P_wrapper);
}

function addPopup_E(id) {

    let popupData = findRecord(id, "id");

    console.log(data);

    userPermissions = [];

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_title = createElem("DIV", [["id", "P_AU_title"], ["innerHTML", "Edit Equipment"], ["class", "NS"]], P_panel);

    const P_grid_info = createElem("DIV", [["id", "P_AU_grid_info"]], P_panel);
    createPopupLbl_AE(P_grid_info, ["Plug:", "DIV", "7558f831-03c8-4a6b-ab9c-d1a9c19fea47", "AE_Plug"]);
    createPopupLbl_AE(P_grid_info, ["Name:", "INPUT", popupData["name"], "AE_Name"]);
    createPopupLbl_AE(P_grid_info, ["Model:", "SELECT", popupData["model"], "AE_Model", MText(popupData)]);

    console.log(MText(popupData));

    const P_add_wrap = createElem("DIV", [["id", "P_AU_update_wrap"]], P_panel);
    const P_add = createElem("BUTTON", [["id", "P_AU_update"], ["class", "P"], ["innerHTML", "Save"], ["onclick", "addEditUser('add')"]], P_add_wrap);

    fadeInPopup(P_wrapper);
}


function createPopupLbl_AE(P_grid, data) { // 0: label text, 1: input type, 2: input placeholder, 3: input id, 4: select elements

    var P_label = createElem("DIV", [["class", "P_AU_label NS"], ["innerHTML", data[0]]], P_grid);
    if (data[1] == "DIV") {

        var P_data = createElem("DIV", [["class", "P_AU_label"], ["id", data[3]], ["innerHTML", data[2]], ["style", "text-align:left; font-size: 0.9rem; margin-left: 20px;"]], P_grid);

    } else if (data[1] == "INPUT") {

        var P_data_wrap = createElem("DIV", [["class", "P_AU_input_wrap"]], P_grid);
        var P_data = createElem("INPUT", [["class", "P_AU_input"], ["id", data[3]], ["value", data[2]]], P_data_wrap);

    } else if (data[1] == "SELECT") {

        var P_data_wrap = createElem("DIV", [["class", "P_AU_input_wrap"]], P_grid);
        var P_data = createElem("SELECT", [["class", "P_AU_select"], ["id", data[3]], ["value", data[2]]], P_data_wrap);

        for (let i = 0; i < data[4].length; i++) {
            if (data[4][i].includes("/s/ ")) {
                let str = data[4][i].replace('/s/ ', '');
                createElem("OPTION", [["value", data[4][i]], ["innerHTML", str], ["selected", ""]], P_data);
            } else {
                createElem("OPTION", [["value", data[4][i]], ["innerHTML", data[4][i]]], P_data);
            }
        }

    } else if (data[1] == "CHECKBOX") {

        var P_data_wrap = createElem("DIV", [["class", "P_AU_input_wrap"]], P_grid);
        var P_data = createElem("INPUT", [["type", "checkbox"], ["id", `check | ${data[0]}`]], P_data_wrap);
        P_data.checked = true;
    }
    return P_data;
}

function MText(popupData) { // Model Text

    var str = [];
    for (var i = 0; i < models.length; i++) {
        if (popupData["model"] == models[i]["name"]) {
            str.push(`/s/ ${models[i]["name"]}`);
        } else {
            str.push(models[i]["name"]);
        }
    }

    return str;
}