const express = require('express');
const request = require('request');
const bodyParser = require("body-parser"); // For parsing data in POST request
const path = require('path');
const ping = require('ping');
const app = express();

const masterIP = "localhost";
const MongoClient = require('mongodb').MongoClient;
var mongoURL = `mongodb://${masterIP}:27017/`;//`mongodb://${masterIP}:27017/`; - "mongodb://joshua:gtd@cluster0-2iznk.mongodb.net/test?retryWrites=true&w=majority"
var mongoURI = "mongodb+srv://joshua:gtd@cluster0-2iznk.mongodb.net/test?retryWrites=true&w=majority"; // Check permissions

module.exports = {

    findExt: function (coll, query, responsefunc) {

        /*const client = new MongoClient(mongoURI, { useNewUrlParser: true });
        client.connect((err, db) => {
            const collection = db.collection(coll);

            collection.find(query).toArray((err, dbres) => {
                if (err) throw err;
                console.log("documents found");
                db.close();
                responsefunc(dbres);
            });
            client.close();
        });*/

        MongoClient.connect(mongoURI, { useNewUrlParser: true }, (err, client) => {
            if (!err) {

                db = client.db('Ideas_lab');
                db.collection(coll).find(query).toArray((err, dbres) => {
                    if (err) throw err;
                    console.log("documents found?");
                    client.close();
                    responsefunc(dbres);
                });
            }
        });
    },

    addExt: function (coll, obj, responsefunc) {

        const client = new MongoClient(mongoURI, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("Ideas_lab").collection(coll);

            collection.insertOne(obj, (err, dbres) => {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
                responsefunc(dbres);
            });
            client.close();
        });
    },

    upsertExt: function (coll, query, obj, responsefunc) {

        const client = new MongoClient(mongoURI, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("Ideas_lab").collection(coll);

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

    updateExt: function (coll, query, obj, responsefunc) {

        const client = new MongoClient(mongoURI, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("Ideas_lab").collection(coll);

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

        MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, db) => {
            if (err) throw err;

            var dbo = db.db("makerspace");
            dbo.collection(collection).find(query).toArray((err, dbres) => {
                if (err) throw err;
                responsefunc(dbres);
            });
        });
    },

    add: function (collection, obj, responsefunc) {

        MongoClient.connect(mongoURL, { useNewUrlParser: true }, function (err, db) {
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

        MongoClient.connect(mongoURL, { useNewUrlParser: true }, function (err, db) {
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

        MongoClient.connect(mongoURL, { useNewUrlParser: true }, function (err, db) {
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