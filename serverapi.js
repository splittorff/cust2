/* The API controller
   Called from servermain
   using the two models below.
   
   
   Missing:
   Encryption of both communication and password in here. 
   
*/


var Customer = require('./servercust.js');
var User = require('./serveruser.js');

exports.newuser = function(req, res) {
	console.log("newuser" + JSON.stringify(req.body));
	peter = new User({ "username": req.body.user, "password": req.body.password});
	console.log(JSON.stringify(peter));
	peter.save();
	
	
	res.end(JSON.stringify({"Gemt": "ok"}));
    //new Thread({title: req.body.title, author: req.body.author}).save();
}

/* only for debug
exports.listusers = function(req, res) { 
  User.find(function(err, threads) {
    res.send(threads);
  });
}
*/

exports.loginuser = function(req, res) {
	
	console.log("login");
	User.findOne({"username": req.body.user}, function (err,obj) {
		if (err)
			res.end(JSON.stringify({"logon": "fail", "msg" : err}));
		else if (obj) {
			console.log("objpw: " + obj.password + "  bodypw: " + req.body.password); 
			if (obj.password == req.body.password)
				res.end(JSON.stringify({"logon": "ok", "youruser": req.body.user, "youruserid": obj._id}));
			else
				res.end(JSON.stringify({"logon": "fail"}));
		} else
			res.end(JSON.stringify({"logon": "fail"}));
	});
}


function notlogin() {
	res.end(JSON.stringify({"logon": "fail", "msg": "You have to be logged in to use this function"}));
}

exports.newcust = function(req, res) {
	console.log("new customer" + JSON.stringify(req.body));
	if (!req.body.user || (req.body.user.length < 1))
		return notlogin();
	User.findOne({"username": req.body.user}, function( err, obj) {
		if (err) 
			return notlogin();
		console.log("obj fra usercheck:" + JSON.stringify(obj));
		if (!obj._id || (obj._id != req.body.userid)) 
			return notlogin();
		var peter = new Customer({ name: req.body.name, email: req.body.email, phone: req.body.phone});
		console.log("Peter:" + JSON.stringify(peter));
		peter.save();
		res.end(JSON.stringify({"Gemt": "ok", "logon": "ok", "youruser": req.body.user, "youruserid" : obj._id || ''}));
	});
}

exports.listcust = function(req, res) {
	if (!req.body.user || (req.body.user.length < 1))
		return notlogin();
	User.findOne({"username": req.body.user}, function( err, obj) {
		if (err) 
			return notlogin();
		console.log("obj fra usercheck:" + JSON.stringify(obj));
		if (!obj._id || (obj._id != req.body.userid)) 
			return notlogin();
		Customer.find(function(err, threads) {
			res.send(threads);
			res.end();
		});
	});
}


/* Søger kunder hvis navn eller e-mail er indeholdt i <str>

list
substr a substr b
og samle the good ones. 

*/

exports.searchcust = (function(req, res) {
	console.log("search hello" + req.body.mytext);
	if (!req.body.user || (req.body.user.length < 1))
		return notlogin();
	User.findOne({"username": req.body.user}, function( err, obj) {
		if (err) 
			return notlogin();
		console.log("obj fra usercheck:" + JSON.stringify(obj));
		if (!obj._id || (obj._id != req.body.userid)) 
			return notlogin();
		Customer.find(function(err2, threads) {
			if (err2)
				res.end({"error": err2});
			var samle = [];
			for (i=0; i < threads.length; i++) {
				if ((req.body.mytext.indexOf(threads[i].name) >= 0) || (req.body.mytext.indexOf(threads[i].email) >= 0)) {
					samle += threads[i];
				}
			}
			if (samle.length)
				// res.end(samle);
				res.end(JSON.stringify(samle));
			else
				res.end(JSON.stringify({"seachResult" : "No match found"}));
			
		});
	});
});



