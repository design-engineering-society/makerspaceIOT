const express = require('express');
const request = require('request');
const path = require('path');
const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/root.html"));
});

app.get("/test", (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Recieved a request from device with IP: ${ip}`);
    res.status(200).send('It Worked ... again!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


function onOff() {

    console.log("onOff");
    const options = {  
        url: 'http://192.168.0.158:80/onOff?plug=1',
        method: 'GET',
        headers: {
            'Accept': 'text/plain',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, (err, res, body) => console.log(body));
}

function updateESP() {

    console.log("updateESP");
    const options = {  
        url: 'http://192.168.0.158:80/update',
        method: 'POST',
        headers: {
            'Accept': 'text/plain',
            'Accept-Charset': 'utf-8'
        },
        json: {
            "IP": "192.168.0.52",
            "description": "3D Printer Rack 2",
            "masterIP": "192.168.0.254",
            "plug1": "3D Printer 5",
            "plug2": "3D Printer 6",
            "plug3": "3D Printer 7",
            "plug4": "3D Printer 8"
        }
    };
    request(options, (err, res, body) => console.log(body));
}