const express = require('express');
const request = require('request');
const app = express();

app.get("/", (req, res) => {
    res.send("<h1>Hello World!!</h1>");
});

app.get("/test", (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Recieved a request from device with IP: ${ip}`);
    res.status(200).send('It Worked ... again!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const options = {  
    url: 'http://192.168.0.158:80/onOff?plug=1',
    method: 'GET',
    headers: {
        'Accept': 'text/plain',
        'Accept-Charset': 'utf-8'
    }
};

request(options, (err, res, body) => console.log(body));