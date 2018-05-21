
var express = require('express');
var app = express();


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/cryptochan";

MongoClient.connect(url, function(err, result) {
  if (err) throw err;
  console.log("Database found!", result);
  db = result;
  db.close();
});


// Connect to database.
// connection.connect();

app.get('/api/test', function(req, res) {
  // Get sent data.
  console.log('server ok');
  res.json([]);
});

app.listen(3001, function() {
  console.log('Example app listening on port 3001!');
});


