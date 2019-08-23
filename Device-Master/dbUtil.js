const express = require('express');
const request = require('request');
const bodyParser = require("body-parser"); // For parsing data in POST request
const path = require('path');
const ping = require('ping');
const app = express();

const masterIP = "localhost";
const MongoClient = require('mongodb').MongoClient;
var mongoURL = `mongodb://${masterIP}:27017/`;//`mongodb://${masterIP}:27017/`; - "mongodb://joshua:gtd@cluster0-2iznk.mongodb.net/test?retryWrites=true&w=majority"
var mongoURI = "mongodb+srv://joshua:gtd@cluster0-2iznk.mongodb.net/test?retryWrites=true&w=majority";//`mongodb://${masterIP}:27017/`;

module.exports = {

    findExt: function (collection, query, responsefunc) {

        const client = new MongoClient(mongoURI, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("MAKERSPACE_IOT").collection(collection);

            collection.find(query).toArray((err, dbres) => {
                if (err) throw err;
                console.log("documents found");
                db.close();
                responsefunc(dbres);
            });
            client.close();
        });
    },

    addExt: function (collection, obj, responsefunc) {

        const client = new MongoClient(mongoURI, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("MAKERSPACE_IOT").collection(collection);

            collection.insertOne(obj, (err, dbres) => {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
                responsefunc(dbres);
            });
            client.close();
        });
    },

    upsertExt: function (collection, query, obj, responsefunc) {
        
        const client = new MongoClient(mongoURI, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("MAKERSPACE_IOT").collection(collection);

            var setObj = { $set: obj };

            collection.updateOne(query, setObj, { upsert: true }, function (err, dbres) {
                if (err) throw err;
                console.log("1 document upserted");
                db.close();
                responsefunc(dbres);
            });
            client.close();
        });
    },

    updateExt: function (collection, query, obj, responsefunc) {

        const client = new MongoClient(mongoURI, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("MAKERSPACE_IOT").collection(collection);

            var setObj = { $set: obj };

            collection.updateOne(query, setObj, function (err, dbres) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
                responsefunc(dbres);
            });
            client.close();
        });
    },

    find: function (collection, query, responsefunc) {

        MongoClient.connect(mongoURL, { useNewUrlParser: true, uri_decode_auth: true }, (err, db) => {
            if (err) throw err;

            var dbo = db.db("makerspace");
            dbo.collection(collection).find(query).toArray((err, dbres) => {
                if (err) throw err;
                responsefunc(dbres);
            });
        });
    },

    add: function (collection, obj, responsefunc) {

        MongoClient.connect(mongoURL, { useNewUrlParser: true, uri_decode_auth: true }, function (err, db) {
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

    upsert: function (collection, query, obj, responsefunc) {

        MongoClient.connect(mongoURL, { useNewUrlParser: true, uri_decode_auth: true }, function (err, db) {
            if (err) throw err;

            var dbo = db.db("makerspace");
            var setObj = { $set: obj };

            dbo.collection(collection).updateOne(query, setObj, { upsert: true }, function (err, dbres) {
                if (err) throw err;
                db.close();
                responsefunc(dbres);
            });
        });
    },

    update: function (collection, query, obj, responsefunc) {

        MongoClient.connect(mongoURL, { useNewUrlParser: true, uri_decode_auth: true }, function (err, db) {
            if (err) throw err;

            var dbo = db.db("makerspace");
            var setObj = { $set: obj };

            dbo.collection(collection).updateOne(query, setObj, function (err, dbres) {
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