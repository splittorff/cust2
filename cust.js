#!/usr/bin/env node
var http = require('http');
var program = require('commander');
var fs = require('fs');  // so save user and id from call to call

var cmd = {};    //json to the api-call
var mypath = "";  // path to same

var huskebruger = { "user" : '', "userid" : '' };   // + noget date ?   -- struct for remember user from session to session. 

// check if we already has a user:
	var fileContents;
	try {
	  fileContents = fs.readFileSync('./rememberMemory.json');
	} catch (err) {
		console.log("No user login");
	  // Here you get the error when the file was not found,
	  // but you also get any other error
	}
	if (fileContents && (fileContents.length > 1))  // no error
		huskebruger = JSON.parse(fileContents);

// console.log("bruger logget ind:" + JSON.stringify(huskebruger));
 
 
// argv - parsing 
program
  .version('0.1.0')
  .arguments('<cmd> [first] [second] [phone]')
  .action(function (cmd, first, second, phone) {
     cmdValue = cmd;
     firstValue = first;
	 secondValue = second;
	 phoneValue = phone;
  });
 
program.parse(process.argv);
 
if (typeof cmdValue === 'undefined') {
   console.error('no command given!');
   process.exit(1);
}

/*
console.log('command:', cmdValue);
console.log('first parameter:', firstValue || "no 1th parameter given");;
console.log('second parameter:', secondValue || "no 2th given");
console.log('third parameter:', phoneValue || "no 3th given");
*/

switch(cmdValue) {
	case 'register' : cmd  = setUser(firstValue, secondValue);
					path = "/krizo";
					break;
					
	case 'login':	cmd  = setUser(firstValue, secondValue);
					path = "/loginuser";
					// *** response til huskenuske
					break; 

	case 'new' :    cmd = setnewcust(firstValue, secondValue, phoneValue);
					path = "/newcust";
					
					break;
					
	case 'list' :	cmd = { "user": huskebruger.user, "userid": huskebruger.userid };   // to use post-call
					path = "/listcust";
					
					
					break;
					
	case 'search':  cmd = searchcust(process.argv);  // skal være resten af argumenterne på argv
					path = "/searchcust";
					
					break;
					
	default:  // error og show help
				console.log(" missing command  -\ncust help\nfor help");
				proces.exit(1);
				break;
}

function setUser(name, pword) {
	
	if (typeof name === 'undefined') {
		console.error('no username given!');
		process.exit(1);
	}
	return { "user" : name, "password": pword || '' };  
}

function setnewcust(name, email, phone) {
	if (typeof name === 'undefined') {
		console.error('no name given!');
		process.exit(1);
	}
	return { "name" : name, "email" : email || '', "phone" : phone || '' ,"user": huskebruger.user, "userid": huskebruger.userid}; 
}

function myjoin(arr) {  // fordi den skal virke både på Windows og linux -- parametrenumrene er forskellige
	samle = "";
	setsearch = false;
	for (i=0; i< arr.length; i++) {
		if (!setsearch && (arr[i] == 'search')) {
			setsearch = true;
		} else if (setsearch) {
			samle = samle + ' ' + arr[i];
		}
	}
	return samle;
}

function searchcust( arrayofstrings) {
	// klask dem sammen med mellerum og op til server
	var mytext = myjoin(arrayofstrings);
	//console.log(mytext);
	
	if (!arrayofstrings) {
		console.error('no text given!');
		process.exit(1);
	}
	return { "mytext" : mytext, "user": huskebruger.user, "userid": huskebruger.userid}; 
}
	




var callback = function(response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {



	var myjson = JSON.parse(str);
	console.log("Svar:");
	console.log(str);  // skal forskønnes !!
	// Vi skal fange "login" : "ok" og naturligvis hvis det IKKE er der ok  *****
	if (myjson.logon) {
		if (myjson.logon == "ok")
			saveolduser(myjson.youruser, myjson.youruserid);
		else
			saveolduser('','');  // kick him	
	}

	//console.log("Far jeg er færdig...");
	});
};



var userString = JSON.stringify(cmd);
//console.log(userString);


var options = {
  host: '188.166.86.135',
  path: path,
  //since we are listening on a custom port, we need to specify it by hand
  port: '4017',
  method: 'POST',

  headers: {"Content-type":"application/json", "encoding" : 'utf-8', 'Content-Length': userString.length}
};


// here comes the api-call:

var req = http.request(options, callback);
//console.log("request sendt")
//This is the data we are posting, it needs to be a string or a buffer
req.write(userString);
//console.log("req writed");
//req.write(user);
req.end();
//console.log("req end");


// rememeber login as : https://stackoverflow.com/questions/40955036/save-value-of-variable-after-running-file-in-node-js-and-using-inquirer
	
function saveolduser(user, userid) {
	huskebruger.user = user;
	huskebruger.userid = userid;
	
	//console.log("gemmer: " + JSON.stringify(huskebruger));
	// efter login + "ikke logget ind" svar fra db.
	fs.writeFileSync('./rememberMemory.json', JSON.stringify(huskebruger) , 'utf-8');  // tjek om _id altid er i utf-8 i mongo
}	