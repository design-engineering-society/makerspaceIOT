const express = require('express');
const request = require('request');
const bodyParser = require("body-parser"); // For parsing data in POST request
const path = require('path');
const ping = require('ping');
const app = express();

const masterIP = "localhost";
const MongoClient = require('mongodb').MongoClient;
var mongoURL = `mongodb://${masterIP}:27017/`;//`mongodb://${masterIP}:27017/`; - "mongodb://joshua:gtd@cluster0-2iznk.mongodb.net/test?retryWrites=true&w=majority"
var mongoURI = "mongodb+srv://Joshua:hardik@cluster0-xkiex.mongodb.net/test?retryWrites=true&w=majority"; // "mongodb+srv://joshua:gtd@cluster0-2iznk.mongodb.net/test?retryWrites=true&w=majority"

module.exports = {

    findExt: function (coll, query, responsefunc) {

        MongoClient.connect(mongoURI, { useNewUrlParser: true }, (err, client) => {

            if (!err) {
                db = client.db('Ideas_lab');
                db.collection(coll).find(query).toArray((err, dbres) => {
                    if (err) throw err;
                    console.log("documents found");
                    client.close();
                    responsefunc(dbres);
                });
            } else {
                console.log(err);
            }
        });
    },

    createExt: function (coll, responsefunc) {

        MongoClient.connect(mongoURI, { useNewUrlParser: true }, (err, client) => {

            if (!err) {
                db = client.db('Ideas_lab');
                db.createCollection(coll, (err, res) => {
                    if (err) throw err;
                    client.close();
                    responsefunc();
                });
            } else {
                console.log(err);
            }
        });
    },

    addExt: function (coll, obj, responsefunc) {

        MongoClient.connect(mongoURI, { useNewUrlParser: true }, (err, client) => {

            if (!err) {
                db = client.db('Ideas_lab');
                db.collection(coll).insertOne(obj, (err, dbres) => {
                    if (err) throw err;
                    console.log("1 document inserted");
                    client.close();
                    responsefunc(dbres);
                });
            } else {
                console.log(err);
            }
        });
    },

    upsertExt: function (coll, query, obj, responsefunc) {

        MongoClient.connect(mongoURI, { useNewUrlParser: true }, (err, client) => {

            if (!err) {
                db = client.db('Ideas_lab');

                var setObj = { $set: obj };

                db.collection(coll).updateOne(query, setObj, { upsert: true }, function (err, dbres) {
                    if (err) throw err;
                    console.log("1 document upserted");
                    client.close();
                    responsefunc(dbres);
                });
            } else {
                console.log(err);
            }
        });
    },

    updateExt: function (coll, query, obj, responsefunc) {

        MongoClient.connect(mongoURI, { useNewUrlParser: true }, (err, client) => {

            if (!err) {
                db = client.db('Ideas_lab');

                var setObj = { $set: obj };

                db.collection(coll).updateOne(query, setObj, function (err, dbres) {
                    if (err) throw err;
                    console.log("1 document updated");
                    client.close();
                    responsefunc(dbres);
                });
            } else {
                console.log(err);
            }
        });
    },

    deleteExt: function (coll, query, responsefunc) {

        MongoClient.connect(mongoURI, { useNewUrlParser: true }, (err, client) => {

            if (!err) {
                db = client.db('Ideas_lab');
                db.collection(coll).deleteMany(query, (err, dbres) => {
                    if (err) throw err;
                    console.log("documents deleted");
                    client.close();
                    responsefunc(dbres);
                });
            } else {
                console.log(err);
            }
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