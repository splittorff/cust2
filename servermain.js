// The main application script, ties everything together.

var express = require('express');
var mongoose = require('mongoose');
var app = express();


var bodyParser = require('body-parser');
var multer = require('multer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data


app.use(function (req, res, next) {
    "use strict";
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, content-type');
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});


// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/krizoanderik');
mongoose.set('debug', true);

// set up the RESTful API, handler methods are defined in api.js
var api = require('./serverapi.js');
app.post('/krizo', api.newuser);
app.post('/loginuser', api.loginuser);
app.post('/newcust', api.newcust);
app.post('/listcust', api.listcust);
app.post('/searchcust', api.searchcust);
//app.get('/thread/:title.:format?', api.show);
//app.get('/listusers', api.list);  // SKAL væk igen ****


var myport = 4017;
app.listen(myport);
console.log("Express server listening on port %d", myport);