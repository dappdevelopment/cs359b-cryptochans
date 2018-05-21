
var express = require('express');
var app = express();


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
let db_name ="cryptochan";
let collection_name="Chan";


// Connect to database.
// connection.connect();

app.get('/api/test', function(req, res) {

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(db_name);
  var query = { name: "Alice" };
  dbo.collection(collection_name).find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
    res.status(200).send(result);
  });
});
});

app.listen(3001, function() {
  console.log('Proxy server app listening on port 3001!');
});


