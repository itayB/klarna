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
  console.log("Database is ready! (total " + db.length + " records)");

});

function isPhone(str) {
  var pattern = "^[0-9/-]{9,11}$";

  return str.match(pattern) != null;
}

function isAge(str) {
  var number = Number(str);
  return isNaN(number) ? false : (number > 0 && number <= 120) ;
}

function isMail(str) {
  var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(str);
}

function patterns(tokens) {
  var res = {
    free: []
  };

  for (var i=0 ; i < tokens.length ; i++) {
    if (isPhone(tokens[i])) {
      res.phone = tokens[i];
    }
    else if (isAge(tokens[i])) {
      res.age = tokens[i];
    }
    else if (isMail(tokens[i])) {
      res.email = tokens[i];
    }
    else {
      res.free.push(tokens[i]);
    }
  }

  return res;
}

function match(patterns, usr) {
  /* If email exist but not match return false. */
  if (patterns.email && usr.email.indexOf(patterns.email) == -1) {
    return false;
  }

  /* If age exist but not match return false. */
  if (patterns.age && patterns.age != getAge(usr.birthday)) {
    return false;
  }

  /* If phone exist but not match return false. */
  if (patterns.phone && patterns.phone.replace("-","") != usr.phone.replace("-","")) {
    return false;
  }

  // TODO: find patterns for city, street, country (with pre-processing dictionaries for example).

  /* All other treats as name. */
  for (var i=0 ; i < patterns.free.length ; i++) {
    if (usr.name.toLowerCase().indexOf(patterns.free[i]) == -1)
      return false;
  }

  return true;
}

app.get('/search', function(req, res) {
  var queryStr = req.query.query;
  
  queryStr = queryStr.toLowerCase();

  var tokens = queryStr.split(" ");
  var p = patterns(tokens);
  var list = [];

  for (var i=0 ; i < db.length ; i++) {
    if (match(p,db[i])) {
      list.push(db[i]);
    }
  }

  console.log(list.length + " results has been found.");
  res.send(list); 
});


app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 3000!');
});


function getAge(birthday) {
  var birthdayYear = new Date(birthday * 1000).getFullYear();
  var currentYear = new Date().getFullYear();
  return currentYear-birthdayYear;
}