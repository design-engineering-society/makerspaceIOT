const express = require('express');
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