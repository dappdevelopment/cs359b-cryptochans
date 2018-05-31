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
//   checkinstreak:
// }


// app.get('/api/test', function(req, res) {

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db(db_name);
//   var query = { name: "Alice"};
//   dbo.collection(collection_name).find(query).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//     res.status(200).send(result);
//   });
// });
// });



//TODO:write apis to get on auction chans, sort by (id,price,...), also should support gender selection
app.get('/api/auctions/:sort/:display/:account', function(req, res) {
MongoClient.connect(url, function(err, db) {
  const sortby = req.params.sort.replace(':', '');
  const display = req.params.display.replace(':', '');
  const account = req.params.account.replace(':', '');
  console.log(sortby,typeof(sortby));
  console.log(display);
  console.log(account);


  if (err) throw err;
  var dbo = db.db(db_name);
  var query = {auction:1};

  switch(display){
    case "3":
      query.gender = 0;
      break;
    case "4":
      query.gender = 1;
      break;
    case "5":
      query.owner = account;
      break;
    default:
      console.log('invalid');
  }

  var mysort = {};
  switch(sortby){
    case "1":
      mysort.name=1;
      break;
    case "2":
      mysort.id=1;
      break;
    default:
      console.log('invalid');
  }

  dbo.collection(collection_name).find(query).sort(mysort).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
    res.status(200).send(result);
  });
});
});



app.get('/api/auctions_sortname', function(req, res) {
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(db_name);
  var query = {auction:1};
  var mysort = {name: 1 };
  dbo.collection(collection_name).find(query).sort(mysort).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
    res.status(200).send(result);
  });
});
});




//TODO:level up



app.post('/api/chan_info', function(req, res) {

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(db_name);
  console.log(req.body,'body???');

  const info = req.body;
  const chan_id = info.id;

  const query = { id: chan_id };

   dbo.collection(collection_name).find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
    res.status(200).send(result);
  });
});
});


app.post('/api/sellchan', function(req, res) {

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(db_name);
  console.log(req.body,'body???');

  const info = req.body;
  const chan_id = parseInt(info.id);


  const myquery = { id: chan_id };
  const newvalues = { $set: { auction:1} };

  dbo.collection(collection_name).updateOne(myquery,newvalues, function(err, result) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
    res.status(200).send(result);
  });
});
});


app.post('/api/buychan', function(req, res) {

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(db_name);
  console.log(req.body,'body???');

  const info = req.body;
  const chan_id = info.id;
  const owner = info.owner;

  const myquery = { id: chan_id };
  const newvalues = { $set: { auction:0, owner: owner} };

  dbo.collection(collection_name).updateOne(myquery,newvalues, function(err, result) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
    res.status(200).send(result);
  });
});
});




app.post('/api/createchan', function(req, res) {

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(db_name);
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


