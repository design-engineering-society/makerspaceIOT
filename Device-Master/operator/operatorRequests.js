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

    xhr.open('GET', `http://${serverIP}/loadESPs`, true); // Retrive ESP data
    xhr.send();
}

/*function refreshRequest() { // Checks what ESPs are active -- Depricated: using a ping method now

    console.log("Started refresh request");
    var ESPdataTemp = copy(ESPdata); // Copy is needed because ESPdata may change during the for loop

    var i;
    for (i = 0; i < Object.keys(ESPdataTemp).length; i++) {

        var xhr = new XMLHttpRequest();
        xhr.onload = function () {

            if (this.status == 404) { // TODO Check 404
                
                removeDocumentWithIP(ESPdataTemp[i]["IP"]);
            }
        };

        xhr.open('GET', `http://${ESPdataTemp[i]["IP"]}/check`, true);
        xhr.send();
    }
}

function removeDocumentWithIP(IP) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {
            
            var i;
            for (i = 0; i < Object.keys(ESPdata).length; i++) { // Find the ESP in ESPData with IP and remove it
                if (ESPdata[i]["IP"] == IP) {
                    ESPdata.splice(i, 1);
                    break;
                }
            }
            console.log(`Removed ESP with IP: ${IP}`)

            reloadDisplay();
        }
    };

    xhr.open('GET', `http://${serverIP}/remove?IP=${IP}`, true);
    xhr.send();
}

function copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === "object") ? copy(v) : v;
    }
    return output;
 }*/