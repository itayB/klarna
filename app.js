var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();

/* Serve all static pages (html/js/css). */
app.use(express.static(path.join(__dirname, 'public')));

/* Save database in memory (TODO: replace with real db - mongo for example). */
var db;

/* Load database from file to memory (only once!). */
fs.readFile(/* __dirname + '/' + */ './people.json', function (err, data) {
  if (err) {
    throw err; 
  }

  /* Parse text to json representation. */
  db = JSON.parse(data);
  console.log("Database is ready! (total " + db.length + " records)");

});

/* Check whether the str match phone pattern. */
function isPhone(str) {
  var pattern = "^[0-9/-]{9,11}$";

  return str.match(pattern) != null;
}

/* Check whether the str match age pattern. */
function isAge(str) {
  var number = Number(str);
  return isNaN(number) ? false : (number > 0 && number <= 120) ;
}

/* Check whether the str match email pattern. */
function isMail(str) {
  var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(str);
}

/* Build structure of known patterns (and unknown as well, called - 'free'). */
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

/* Finding matchs between recognized patterns and specific usr. */
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

/* GET /search?query=something request - to search for people. */
app.get('/search', function(req, res) {
  /* Retrive GET parameter (query). */
  var queryStr = req.query.query;
  
  /* To lower case - to compare iCaseSensitive. */
  queryStr = queryStr.toLowerCase();

  /* Split query string to tokens (words). */
  var tokens = queryStr.split(" ");

  /* Try to catch some patterns (such as: email, phone, age). */
  var p = patterns(tokens);
  
  /* Result list (will return to client). */
  var list = [];

  /* Iterate over database to find matchs. */
  for (var i=0 ; i < db.length ; i++) {
    if (match(p,db[i])) {
      list.push(db[i]);
    }
  }

  console.log(list.length + " results has been found.");
  res.send(list); 
});

/* Listening callback. */
app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 3000!');
});

/* get timestamp of birthday and return age number (1-120). */
function getAge(birthday) {
  var birthdayYear = new Date(birthday * 1000).getFullYear();
  var currentYear = new Date().getFullYear();
  return currentYear-birthdayYear;
}