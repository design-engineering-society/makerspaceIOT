const express = require('express');
const request = require('request');
const bodyParser = require("body-parser"); // For parsing data in POST request
const path = require('path');
const ping = require('ping');
const app = express();

const MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/";

module.exports = {

    find: function(collection, query, responsefunc) {

        MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, db) => {
            if (err) throw err;

            var dbo = db.db("makerspace");
            dbo.collection(collection).find(query).toArray((err, dbres) => {
                if (err) throw err;
                responsefunc(dbres);
            });
        });
    },

    add: function(collection, obj, responsefunc) {

        MongoClient.connect(mongoURL, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("makerspace");
        
            dbo.collection(collection).insertOne(obj, (err, dbres) => {
              if (err) throw err;
              console.log("1 document inserted");
              db.close();
              responsefunc(dbres);
            });
        });
    },

    upsert: function(collection, query, obj, responsefunc) {

        MongoClient.connect(mongoURL, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
    
            var dbo = db.db("makerspace");
            var setObj = {$set: obj};
            dbo.collection("Users").updateOne(query, setObj, {upsert: true}, function(err, dbres) {
                if (err) throw err;
                db.close();
                responsefunc(dbres);
            });
        });
    }
};

/*


updateDB(data, query, req, res);


*/