var https = require("https");
var fs = require("fs");
var WebSocket = require("ws");

var startWs = () => {
  var server;
  var wss;
  if(process.argv[2] == "product"){
    server = https.createServer({
      cert: fs.readFileSync(__dirname+'/greenlock.d/live/chattest.ddns.net/cert.pem'),
      key: fs.readFileSync(__dirname+'/greenlock.d/live/chattest.ddns.net/privkey.pem')
    });
    console.log("honban mode")
    wss = new WebSocket.Server({ server });
  }else{
    wss = new WebSocket.Server({ port: 8080 });
  }

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
}
module.exports = startWs;