var models = [];
var userPermissions = [];


function Users_loadFunction() {
    loadUsers();
}


function loadUsers() {

    setLoadingText("Loading user data");

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            data = JSON.parse(this.responseText);
            if (!data["error"]) {
                //console.log(data);
                //console.log(`Loaded ${Object.keys(data).length} Users(s) from database`);

            } else {
                data = [];
                console.log("Error loading Users");
            }
            loadModels();
        }
    };

    xhr.open('GET', `http://${serverIP}/loadUsers`, true); // Retrive ESP data
    xhr.send();
}


function loadModels() {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            var data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                console.log(`Loaded ${Object.keys(data).length} Equipment(s) from database`);
                models = data;

                models.sort((a, b) => {

                    if (a["precedent"] < b["precedent"]) return -1;
                    if (a["precedent"] > b["precedent"]) return 1;
                    return 0;
                });
            } else {
                data = [];
                console.log("Error loading models");
            }
            refreshTable("Users");
            removeLoadingScreen();
        }
    };

    xhr.open('GET', `http://${serverIP}/load?collection=Model_info`, true); // Retrive ESP data
    xhr.send();
}


function addEditUser(mode) {

    const URI = (mode == "add") ? `http://${serverIP}/addUser` : `http://${serverIP}/editUser`;

    console.log(userPermissions);

    const userData = {
        "First Name": document.getElementById("AU_Firstname").value,
        "Last Name": document.getElementById("AU_Lastname").value,
        "Email": document.getElementById("AU_Email").value,
        "Card ID": (mode == "add") ? document.getElementById("AU_Card_ID").value : document.getElementById("AU_Card_ID").innerHTML,
        "CID": document.getElementById("AU_CID").value,
        "Role": document.getElementById("AU_Role").value.replace('/s/ ', ''),
        "Credit": document.getElementById("AU_Credit").value,
        "Permissions": userPermissions
    };

    fadeOutPopup();

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                //console.log(`Loaded ${Object.keys(data).length} Users(s) from database`);

            } else {
                data = [];
                console.log("Error loading Users");
            }
            refreshTable("Users");
        }
    };

    xhr.open('POST', URI, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(userData));
}


function filterUsers(mode) {

    var URI;

    switch (mode) {
        case "filter": URI = `http://${serverIP}/filterUsers`; break;
        case "remove": URI = `http://${serverIP}/removeUsers`; break;
        case "addCredit": URI = `http://${serverIP}/addCreditToUsers`; break;
        default: URI = `http://${serverIP}/error`; break;
    }

    const userData = {
        "First Name": document.getElementById("F_Firstname").value,
        "Last Name": document.getElementById("F_Lastname").value,
        "Email": document.getElementById("F_Email").value,
        "Card ID": document.getElementById("F_Card_ID").value,
        "CID": document.getElementById("F_CID").value,
        "Role": document.getElementById("F_Role").value.replace('/s/ ', ''),
        "Credit": document.getElementById("F_Credit").value
    };

    fadeOutPopup();

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {
            data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                //console.log(`Loaded ${Object.keys(data).length} Users(s) from database`);

            } else {
                data = [];
                console.log("Error loading Users");
            }
            refreshTable("Users");
        }
    };

    xhr.open('POST', URI, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(userData));
}


function addPopupU_AU() {

    userPermissions = [];

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_title = createElem("DIV", [["id", "P_AU_title"], ["innerHTML", "Add user"], ["class", "NS"]], P_panel);

    const P_grid_top = createElem("DIV", [["id", "P_AU_grid_top"]], P_panel);
    const P_button_info = createElem("DIV", [["class", "P_AU_button_top P"], ["id", "P_AU_button_info"], ["innerHTML", "Info"], ["onclick", "P_AU_toggle_tab('info')"], ["style", "font-weight: 600;"]], P_grid_top);
    const P_button_permissions = createElem("DIV", [["class", "P_AU_button_top P"], ["id", "P_AU_button_permissions"], ["innerHTML", "Permissions"], ["onclick", "P_AU_toggle_tab('permissions')"]], P_grid_top);

    const P_grid_info = createElem("DIV", [["id", "P_AU_grid_info"]], P_panel);
    createPopupLbl_AU(P_grid_info, ["Firstname:", "INPUT", "", "AU_Firstname"]);
    createPopupLbl_AU(P_grid_info, ["Lastname:", "INPUT", "", "AU_Lastname"]);
    createPopupLbl_AU(P_grid_info, ["Email:", "INPUT", "", "AU_Email"]);
    createPopupLbl_AU(P_grid_info, ["Card ID:", "INPUT", "", "AU_Card_ID"]);
    createPopupLbl_AU(P_grid_info, ["CID:", "INPUT", "", "AU_CID"]);
    createPopupLbl_AU(P_grid_info, ["Role:", "SELECT", "", "AU_Role", ["/s/  User", "Rep", "Admin"]]);
    createPopupLbl_AU(P_grid_info, ["Credit:", "INPUT", "", "AU_Credit"]);

    const P_grid_permissions = createElem("DIV", [["id", "P_AU_grid_permissions"], ["style", "display:none"]], P_panel);
    for (var i = 0; i < models.length; i++) {
        createElem("DIV", [["class", "P_AU_button_permissions P_AU_bp_unselected P NS"],
        ["innerHTML", models[i]["name"]],
        ["id", `P_AU_${models[i]["name"]}`],
        ["onclick", `P_AU_update_Permission_UI("${models[i]["name"]}")`]], P_grid_permissions);
    }

    const P_add_wrap = createElem("DIV", [["id", "P_AU_update_wrap"]], P_panel);
    const P_add = createElem("BUTTON", [["id", "P_AU_update"], ["class", "P"], ["innerHTML", "Add"], ["onclick", "addEditUser('add')"]], P_add_wrap);

    fadeInPopup(P_wrapper);
}


function addPopupU_RU() {

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_title = createElem("DIV", [["id", "P_AU_title"], ["innerHTML", "Remove Users"], ["class", "NS"]], P_panel);

    const P_filter_header = createElem("DIV", [["id", "P_RU_filter_header"], ["innerHTML", "Filter"], ["class", "NS"]], P_panel);
    const P_grid_filter = createElem("DIV", [["id", "P_AU_grid_info"], ["style", "margin: 10px 30px 0px 30px;"]], P_panel);
    createPopupLbl_AU(P_grid_filter, ["Firstname:", "INPUT", "", "F_Firstname"]);
    createPopupLbl_AU(P_grid_filter, ["Lastname:", "INPUT", "", "F_Lastname"]);
    createPopupLbl_AU(P_grid_filter, ["Email:", "INPUT", "", "F_Email"]);
    createPopupLbl_AU(P_grid_filter, ["Card ID:", "INPUT", "", "F_Card_ID"]);
    createPopupLbl_AU(P_grid_filter, ["CID:", "INPUT", "", "F_CID"]);
    createPopupLbl_AU(P_grid_filter, ["Role:", "SELECT", "", "F_Role", ["/s/ ", "User", "Rep", "Admin"]]);
    createPopupLbl_AU(P_grid_filter, ["Credit:", "INPUT", "", "F_Credit"]);

    const P_filter_wrap = createElem("DIV", [["id", "P_AU_update_wrap"]], P_panel);
    const P_filter = createElem("BUTTON", [["id", "P_AU_update"], ["class", "P"], ["innerHTML", "Remove"], ["onclick", "filterUsers('remove')"]], P_filter_wrap);

    fadeInPopup(P_wrapper);
}


function addPopup_E(id) {

    let popupData = findRecord(id, "Card ID");

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_title = createElem("DIV", [["id", "P_AU_title"], ["innerHTML", "Edit user"], ["class", "NS"]], P_panel);

    const P_grid_top = createElem("DIV", [["id", "P_AU_grid_top"]], P_panel);
    const P_button_info = createElem("DIV", [["class", "P_AU_button_top P"], ["id", "P_AU_button_info"], ["innerHTML", "Info"], ["onclick", "P_AU_toggle_tab('info')"], ["style", "font-weight: 600;"]], P_grid_top);
    const P_button_permissions = createElem("DIV", [["class", "P_AU_button_top P"], ["id", "P_AU_button_permissions"], ["innerHTML", "Permissions"], ["onclick", "P_AU_toggle_tab('permissions')"]], P_grid_top);

    const P_grid_info = createElem("DIV", [["id", "P_AU_grid_info"]], P_panel);
    createPopupLbl_AU(P_grid_info, ["Card ID:", "DIV", popupData["Card ID"], "AU_Card_ID"]);
    createPopupLbl_AU(P_grid_info, ["Firstname:", "INPUT", popupData["First Name"], "AU_Firstname"]);
    createPopupLbl_AU(P_grid_info, ["Lastname:", "INPUT", popupData["Last Name"], "AU_Lastname"]);
    createPopupLbl_AU(P_grid_info, ["Email:", "INPUT", popupData["Email"], "AU_Email"]);
    createPopupLbl_AU(P_grid_info, ["CID:", "INPUT", popupData["CID"], "AU_CID"]);
    createPopupLbl_AU(P_grid_info, ["Role:", "SELECT", popupData["Role"], "AU_Role", autoSelect(popupData["Role"], ["User", "Rep", "Admin"])]);
    createPopupLbl_AU(P_grid_info, ["Credit:", "INPUT", popupData["Credit"], "AU_Credit"]);

    const P_grid_permissions = createElem("DIV", [["id", "P_AU_grid_permissions"], ["style", "display:none"]], P_panel);
    userPermissions = popupData["Permissions"];
    for (var i = 0; i < models.length; i++) {

        var permissionElem = createElem("DIV", [["class", "P_AU_button_permissions P_AU_bp_unselected P NS"],
        ["innerHTML", models[i]["name"]],
        ["id", `P_AU_${models[i]["name"]}`],
        ["onclick", `P_AU_update_Permission_UI("${models[i]["name"]}")`]], P_grid_permissions);

        for (var j = 0; j < userPermissions.length; j++) {
            if (userPermissions[j] == models[i]["name"]) {
                permissionElem.setAttribute("class", "P_AU_button_permissions P_AU_bp_selected P NS");
                break;
            }
        }
    }

    const P_save_wrap = createElem("DIV", [["id", "P_AU_update_wrap"]], P_panel);
    const P_save = createElem("BUTTON", [["id", "P_AU_update"], ["class", "P"], ["innerHTML", "save"], ["onclick", "addEditUser('edit')"]], P_save_wrap);

    fadeInPopup(P_wrapper);
}


function addPopupU_AC() {

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_title = createElem("DIV", [["id", "P_AU_title"], ["innerHTML", "Add Credit To Users"], ["class", "NS"]], P_panel);

    const P_filter_header = createElem("DIV", [["id", "P_RU_filter_header"], ["innerHTML", "Filter"], ["class", "NS"]], P_panel);
    const P_grid_filter = createElem("DIV", [["id", "P_AU_grid_info"], ["style", "margin: 10px 30px 0px 30px;"]], P_panel);
    createPopupLbl_AU(P_grid_filter, ["Firstname:", "INPUT", "", "F_Firstname"]);
    createPopupLbl_AU(P_grid_filter, ["Lastname:", "INPUT", "", "F_Lastname"]);
    createPopupLbl_AU(P_grid_filter, ["Email:", "INPUT", "", "F_Email"]);
    createPopupLbl_AU(P_grid_filter, ["Card ID:", "INPUT", "", "F_Card_ID"]);
    createPopupLbl_AU(P_grid_filter, ["CID:", "INPUT", "", "F_CID"]);
    createPopupLbl_AU(P_grid_filter, ["Role:", "SELECT", "", "F_Role", ["/s/ ", "User", "Rep", "Admin"]]);
    createPopupLbl_AU(P_grid_filter, ["Credit:", "INPUT", "", "F_Credit"]);

    const P_filter_wrap = createElem("DIV", [["id", "P_AU_update_wrap"]], P_panel);
    const P_filter = createElem("BUTTON", [["id", "P_AU_update"], ["class", "P"], ["innerHTML", "Add Credit"], ["onclick", "filterUsers('addCredit')"]], P_filter_wrap);

    fadeInPopup(P_wrapper);
}


function addPopupU_F() {

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_title = createElem("DIV", [["id", "P_AU_title"], ["innerHTML", "Filter Display"], ["class", "NS"]], P_panel);

    const P_grid_filter = createElem("DIV", [["id", "P_AU_grid_info"]], P_panel);
    createPopupLbl_AU(P_grid_filter, ["Firstname:", "INPUT", "", "F_Firstname"]);
    createPopupLbl_AU(P_grid_filter, ["Lastname:", "INPUT", "", "F_Lastname"]);
    createPopupLbl_AU(P_grid_filter, ["Email:", "INPUT", "", "F_Email"]);
    createPopupLbl_AU(P_grid_filter, ["Card ID:", "INPUT", "", "F_Card_ID"]);
    createPopupLbl_AU(P_grid_filter, ["CID:", "INPUT", "", "F_CID"]);
    createPopupLbl_AU(P_grid_filter, ["Role:", "SELECT", "", "F_Role", ["/s/ ", "User", "Rep", "Admin"]]);
    createPopupLbl_AU(P_grid_filter, ["Credit:", "INPUT", "", "F_Credit"]);

    const P_filter_wrap = createElem("DIV", [["id", "P_AU_update_wrap"]], P_panel);
    const P_filter = createElem("BUTTON", [["id", "P_AU_update"], ["class", "P"], ["innerHTML", "Filter"], ["onclick", "filterUsers('filter')"]], P_filter_wrap);

    fadeInPopup(P_wrapper);
}


function createPopupLbl_AU(P_grid, data) { // 0: label text, 1: input type, 2: input placeholder, 3: input id, 4: select elements

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


function P_AU_toggle_tab(mode) {

    var permissionsGrid = document.getElementById("P_AU_grid_permissions");
    var infoGrid = document.getElementById("P_AU_grid_info");
    var permissionsButton = document.getElementById("P_AU_button_permissions");
    var infoButton = document.getElementById("P_AU_button_info");

    if (mode == "info") {
        permissionsGrid.setAttribute("style", "display:none;")
        infoGrid.setAttribute("style", "display:grid;")
        permissionsButton.setAttribute("style", "font-weight: 200;")
        infoButton.setAttribute("style", "font-weight: 600;")
    } else {
        permissionsGrid.setAttribute("style", "display:grid;")
        infoGrid.setAttribute("style", "display:none;")
        permissionsButton.setAttribute("style", "font-weight: 600;")
        infoButton.setAttribute("style", "font-weight: 200;")
    }
}


function P_AU_update_Permission_UI(modelName) {

    var button = document.getElementById(`P_AU_${modelName}`)

    for (var i = 0; i < userPermissions.length; i++) {
        if (userPermissions[i] == modelName) {
            userPermissions.splice(i, 1);
            button.setAttribute("class", "P_AU_button_permissions P_AU_bp_unselected P NS")
            return;
        }
    }
    userPermissions.push(modelName);
    button.setAttribute("class", "P_AU_button_permissions P_AU_bp_selected P NS")
}