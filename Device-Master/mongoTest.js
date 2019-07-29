var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/*MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("makerspace");
  dbo.createCollection("ESP2", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});*/

/*MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("makerspace");
    var myobj = 
    {
        IP: "192.168.0.158",
        description: "3D Printer Rack NEW",
        masterIP: "192.168.0.110",
        routerIP: "192.168.0.254",
        plug1Lbl: "3D Printer 5",
        plug2Lbl: "3D Printer 6",
        plug3Lbl: "3D Printer 7",
        plug4Lbl: "3D Printer 8"
    };

    dbo.collection("ESP").insertOne(myobj, (err, res) => {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });*/

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("makerspace");
    dbo.collection("ESP").find({}).toArray((err, result) => {
      if (err) throw err;
      console.log(result[0]["IP"]);
      db.close();
    });
  });

/*
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
*/