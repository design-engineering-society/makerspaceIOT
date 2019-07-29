var FormData= require('form-data');
var fs = require('fs');

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

var form = new FormData();
newFunction();
form.append("select", "true");
form.append("print", "true");

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://146.169.219.10" + "/api/files/local",
  "method": "POST",
  "headers": {
    "x-api-key": dec34b8d5e7df9108af2a36c820e9782,
    "cache-control": "no-cache",
  },
  "processData": false,
  "contentType": false,
  "mimeType": "multipart/form-data",
  "data": form
}

$.ajax(settings).done(function (response) {
  console.log(response);
});

function newFunction() {
    form.append("file", $('/index.html')[0].files[0]);
}
