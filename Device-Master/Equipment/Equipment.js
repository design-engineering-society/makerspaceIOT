function Equipment_loadFunction() {
    loadEquipment();
}

function loadEquipment() { // Requests to load all the ESP data from the database

    setLoadingText("Loading equipment data");

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                console.log(`Loaded ${Object.keys(data).length} Equipment Object(s) from database`);

            } else {
                data = [];
                console.log("Error loading Equipment");
            }
            refreshTable("Equipment");
            removeLoadingScreen();
        }
    };

    xhr.open('GET', `http://${serverIP}/loadEquipment`, true); // Retrive ESP data
    xhr.send();
}