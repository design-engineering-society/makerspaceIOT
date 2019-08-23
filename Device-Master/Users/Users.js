function Users_loadFunction() {
    loadUsers();
}

function loadUsers() { // Requests to load all the ESP data from the database

    setLoadingText("Loading user data");

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                console.log(`Loaded ${Object.keys(data).length} Users(s) from database`);

            } else {
                data = [];
                console.log("No Users found");
            }
            refreshTable("Users");
            removeLoadingScreen();
        }
    };

    xhr.open('GET', `http://${serverIP}/loadUsers`, true); // Retrive ESP data
    xhr.send();
}

function addPopupU_AU() {

    //let popupData = findRecord(id);

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_grid = createElem("DIV", [["id", "P_grid"]], P_panel);
    const P_title = createElem("DIV", [["id", "P_title"], ["innerHTML", "Add user"], ["class", "NS"]], P_grid);

    createPopupLbl(P_grid, ["CID:", "INPUT", "", "U_AU_CID"]);
    createPopupLbl(P_grid, ["Username:", "INPUT", "", "U_AU_username"]);
    createPopupLbl(P_grid, ["First Name:", "INPUT", "", "U_AU_firstname"]);
    createPopupLbl(P_grid, ["Last Name:", "INPUT", "", "U_AU_lastname"]);
    createPopupLbl(P_grid, ["Department:", "SELECT", "", "U_AU_department",
        ["/s/ Design Engineering",
            "Electronic and Information Engineering"]]);
    createPopupLbl(P_grid, ["Program:", "SELECT", "", "U_AU_program",
        ["BEng", "BA", "BSc", "/s/ MEng", "MA", "MSc"]]);
    createPopupLbl(P_grid, ["Description:", "INPUT", "", "U_AU_description"]);
    createPopupLbl(P_grid, ["Study Date Start:", "INPUT", "", "U_AU_sds"]);
    createPopupLbl(P_grid, ["Study Date End:", "INPUT", "", "U_AU_sde"]);
    createPopupLbl(P_grid, ["Study Year:", "INPUT", "", "U_AU_studyyear"]);
    createPopupLbl(P_grid, ["Role:", "SELECT", "", "U_AU_role", ["/s/ user", "rep"]]);
    createPopupLbl(P_grid, ["Equipment Type Access:", "INPUT", "", "U_AU_eta"]);
    createPopupLbl(P_grid, ["Credit:", "INPUT", "", "U_AU_credit"]);
    createPopupLbl(P_grid, ["Date User Inducted:", "INPUT", "", "U_AU_dui"]);
    createPopupLbl(P_grid, ["Remarks:", "INPUT", "", "U_AU_remarks"]);

    const P_add_wrap = createElem("DIV", [["id", "P_update_wrap"]], P_grid);
    const P_add = createElem("BUTTON", [["id", "P_update"], ["innerHTML", "Add User"]], P_update_wrap);

    fadeInPopup(P_wrapper);
}