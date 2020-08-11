var https = require("https");
var fs = require("fs");
var WebSocket = require("ws");

var wslist = [];
var chat_que = [];
var designing = false;
var chatpair = [];

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
    var yourIDobj = {
      "event": "yourID",
      "data": client_id,
      "date": getDate()
    }
    ws.send(JSON.stringify(yourIDobj));
    wslist.push({id: client_id, ws: ws, pair: ""});

    ws.on('message', (message) => {
      var parsed = JSON.parse(message);
      switch(parsed.event){
        case "searchOpponent":
        console.log("get searchOpponent request from "+client_id);
        chat_que.push(client_id);
        break;

        case "sendMes":

        break;

        case "endChat":

        break;
      }
    });

    ws.onclose = (event) => {
      console.log("client disconnected id="+client_id)
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

// matching client
setInterval(() => {
  if(chat_que.length >= 2) {
    var a_id = chat_que.shift();
    var b_id = chat_que.shift();
    chatpair.push({a: a_id, b: b_id});
    var acli = wslist.findIndex(w => {
      return w.id == a_id;
    });
    var bcli = wslist.findIndex(w => {
      return w.id == b_id;
    });
    wslist[acli].pair = b_id;
    wslist[bcli].pair = a_id;
    var mes = {
      event: "findOpponent",
      date: getDate()
    }
    var mesStr = JSON.stringify(mes);
    wslist[acli].ws.send(mesStr);
    wslist[bcli].ws.send(mesStr);
    console.log("matching client");
    console.log(a_id+" to "+b_id);
    console.log(chatpair)
    console.log(wslist)
  }
}, 1000)

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

function getDate(){
  var dt = new Date();
  var unixtime = dt.getTime();
  return unixtime;
}

module.exports = startWs;