const serverIP = "localhost:5000";
var ESPdata;

function loadESPRequest() { // Requests to load all the ESP data from the database

    console.log("loadESPs");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {
            ESPdata = JSON.parse(this.responseText);
            console.log(ESPdata);
            console.log(`Loaded ${Object.keys(ESPdata).length} ESP(s) from database`);
            
            reloadDisplay();
        }
    };

    xhr.open('GET', `http://${serverIP}/loadESPData`, true); // Retrive ESP data
    xhr.send();
}