var express = require('express');
var app = express();
var mysql = require('mysql');
var server = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(server);
var Twit = require('twit');
var searches = {};

//Connect to database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_tes"
});


con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});


// con.query('SELECT * FROM tweet',function(err,rows){
//   if(err) throw err;

//   console.log('Data received from Db:\n');
//   console.log(rows);

// });

var T = new Twit({
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  '',
  //app_only_auth: true
});

var q = '@Viny_JKT48';

var stream = T.stream('statuses/filter', { track: q })
 
stream.on('tweet', function (tweet) {

	var t_text = tweet.text;
	var t_id = tweet.id_str;
	var t_name = tweet.user.name;
	var t_username = tweet.user.screen_name;
	var t_link = 'https://twitter.com/' + t_username + '/status/' + t_id;

	if(!tweet.hasOwnProperty('retweeted_status')){
		console.log('Tweet : ' + t_text);
		console.log('Username : ' + t_username);
		console.log('Name : @' + t_name);
		console.log('Link : ' + t_link);
		console.log(' ');

		var query_tweet = { query: q, user: t_username, name: t_name, text: t_text, link: t_link };
		con.query('INSERT INTO tweet SET ?', query_tweet, function(err,res){
		if(err) throw err;
			//console.log('Last insert ID:', res.insertId);
		});
	};
})

server.listen(3000);
console.log('Server listening on port 3000');
