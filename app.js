"use strict";

var express = require("express");
var app = express();
var https = require("https");
var fs = require("fs");
var ws = require("ws");

var server = {port: 8080}
if(process.argv[2] == "product"){
  server = https.createServer({
    cert: fs.readFileSync(__dirname+'/greenlock.d/live/chattest.ddns.net/cert.pem'),
    key: fs.readFileSync(__dirname+'/greenlock.d/live/chattest.ddns.net/privkey.pem')
  });
  console.log("honban mode")
}
const wss = new ws.Server({ server });
wss.on('connection', function connection(ws,req) {
    const ip = req.connection.remoteAddress;
    console.log('---connect from ' + ip);
    ws.send('Hello from wssServer!');
    ws.on('message', function incoming(message) {
        console.log(message);
    });
	ws.onerror = (event) => {
		console.error(event.message);
		console.log(event)
		ws.close();
	};
});
if(process.argv[2] == "product"){
  server.listen(8080)
}

app.use(express.static('./public/'));

app.get("/", function(req, res) {
    res.sendFile(__dirname+'/public/html/test.html');
    console.log(req.ip)
});


// DO NOT DO app.listen() unless we're testing this directly
if (require.main === module) {
    app.listen(3000);
}

// Instead do export the app:
module.exports = app;