var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

var db;

fs.readFile(/* __dirname + '/' + */ './people.json', function (err, data) {
  if (err) {
    throw err; 
  }

  db = JSON.parse(data);
  console.log("Database is ready!");

});

app.get('/search', function(req, res) {
  var queryStr = req.query.query;
  
  //TODO: validate number
  var size = Number(req.query.size);



  queryStr = queryStr.toLowerCase();


  var tokens = queryStr.split(" ");
  var list = [];

  for (var i=0 ; i < db.length && list.length < size ; i++) {
    if (db[i].name.toLowerCase().indexOf(queryStr) !== -1) {
      list.push(db[i]);
    }
  }

  console.log(list.length + " results has been found.");
  res.send(list); 
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});