var https = require("https");
var fs = require("fs");
var WebSocket = require("ws");

var wslist = [];

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

  wss.on('connection', (ws,req) => {
    const ip = req.connection.remoteAddress;
    console.log('---connect from ' + ip);
    ws.send('Hello from wssServer!');
    var client_id = make_random();
    var dt = new Date();
    var unixtime = dt.getTime();
    var yourIDobj = {
      "event": "yourID",
      "data": client_id,
      "date": unixtime
    }
    ws.send(JSON.stringify(yourIDobj));
    wslist.push({id: client_id, ws: ws});

    ws.on('message', (message) => {
      var parsed = JSON.parse(message);
      switch(parsed.event){
        case "searchOpponent":

        break;

        case "sendMes":

        break;

        case "endChat":

        break;
      }
    });

    ws.onclose = (event) => {
      console.log(client_id)
    }

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

function make_random(){
  var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  var N=16
  do {
    var new_id = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('');
    var f = wslist.find(item => {
      return (item.id === new_id)
    })
  } while(f)
  return new_id;
}

module.exports = startWs;