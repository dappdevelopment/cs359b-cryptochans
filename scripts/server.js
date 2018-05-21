
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
let db_name ="cryptochan";
let collection_name="Chan";


//db document format:

// {
//   chan_id:0
//   name:"Alice"
//   level:0
//   gender:0 //0===female, 1===male
//   birthday:xxxxxx
//   is_on_auction:0 //0===not on auction, 1===on auction
//   owner:"xxxx" //address
//   start_price:10
//   end_price:0
//   duration:24
// }


// Connect to database.
// connection.connect();

app.get('/api/test', function(req, res) {

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(db_name);
  var query = { name: "Alice"};
  dbo.collection(collection_name).find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
    res.status(200).send(result);
  });
});
});




app.post('/api/createchan', function(req, res) {

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(db_name);
  console.log(req);
  console.log(req.body,'body???');
  dbo.collection(collection_name).insertOne(req.body, function(err, result) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
    res.status(200).send(result);
  });
});
});




app.listen(3001, function() {
  console.log('Proxy server app listening on port 3001!');
});


