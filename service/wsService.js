var https = require("https");
var fs = require("fs");
var WebSocket = require("ws");

var wslist = [];
var guest_que = [];
var driver_que = [];
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
        case "searchGuest":
        console.log("get searchGuest request from "+parsed.clientId);
        var target = wslist.findIndex(w => {
          return w.id == parsed.clientId
        });
        if(target == -1){
          console.log("client id "+parsed.clientId+" doesn't exist");
        }else if(wslist[target].pair != ""){
          console.log("client "+parsed.clientId+" is already matching with "+wslist[target].pair);
        }else if(guest_que.includes(parsed.clientId)) {
          console.log("client "+parsed.clientId+" is already searching guest");
        }else if(driver_que.includes(parsed.clientId)){
          console.log("client "+parsed.clientId+" is already searching driver");
        }else{
          guest_que.push(parsed.clientId);
        }
        break;

        case "searchDriver":
        console.log("get searchDriver request from "+parsed.clientId);
        var target = wslist.findIndex(w => {
          return w.id == parsed.clientId
        });
        if(target == -1){
          console.log("client id "+parsed.clientId+" doesn't exist");
        }else if(wslist[target].pair != ""){
          console.log("client "+parsed.clientId+" is already matching with "+wslist[target].pair);
        }else if(guest_que.includes(parsed.clientId)) {
          console.log("client "+parsed.clientId+" is already searching guest");
        }else if(driver_que.includes(parsed.clientId)){
          console.log("client "+parsed.clientId+" is already searching driver");
        }else{
          driver_que.push(parsed.clientId);
        }
        break;

        case "sendMes":
        console.log("get sendMes request from "+parsed.clientId);
        var target = wslist.findIndex(w => {
          return w.id == parsed.clientId
        });
        if(target == -1){
          console.log("client id "+parsed.clientId+" doesn't exist");
        }else if(wslist[target].pair == ""){
          console.log("client "+parsed.clientId+" is not chatting");
        }else{
          var opponent = wslist.find(w => {
            return w.id == wslist[target].pair;
          })
          console.log(opponent)
          var mes = {
            event: "receiveMes",
            data: parsed.data,
            date: getDate()
          }
          var mesStr = JSON.stringify(mes);
          opponent.ws.send(mesStr);
          console.log(mesStr)
        }
        break;

        case "endChat":
        console.log("get endChat request from "+parsed.clientId);
        var target = wslist.findIndex(w => {
          return w.id == parsed.clientId
        });
        if(target == -1){
          console.log("client id "+parsed.clientId+" doesn't exist");
        }else if(wslist[target].pair == ""){
          console.log("client "+parsed.clientId+" is not chatting");
        }else{
          var opponent = wslist.find(w => {
            return w.id == wslist[target].pair;
          });
          wslist[target].pair = "";
          chatpair = chatpair.filter(c => {
            return c.a != wslist[target].id && c.b != wslist[target].id
          });
          console.log(chatpair)
          var mes = {
            event: "endedChat",
            date: getDate()
          }
          var mesStr = JSON.stringify(mes);
          opponent.ws.send(mesStr);
        }
        break;
      }
    });

    ws.onclose = (event) => {
      console.log("websocket close from "+client_id);
      var target = wslist.findIndex(w => {
        return w.id == client_id
      });
      if(target == -1){
        console.log("client id "+client_id+" doesn't exist");
      }else if(wslist[target].pair == ""){
        console.log("client "+client_id+" was not chatting");
        wslist = wslist.filter(w => {
          return w.id != client_id
        });
        console.log(chatpair)
        console.log(wslist)
      }else{
        var opponent = wslist.findIndex(w => {
          return w.id == wslist[target].pair;
        });
        wslist[opponent].pair = "";
        wslist[target].pair = "";
        chatpair = chatpair.filter(c => {
          return c.g != wslist[target].id && c.d != wslist[target].id
        });
        wslist = wslist.filter(w => {
          return w.id != client_id
        });
        var mes = {
          event: "endedChat",
          date: getDate()
        }
        var mesStr = JSON.stringify(mes);
        wslist[opponent].ws.send(mesStr);
        console.log(chatpair)
        console.log(wslist)
      }
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
  if(guest_que.length >= 1 && driver_que.length >= 1) {
    var g_id = guest_que.shift();
    var d_id = driver_que.shift();
    chatpair.push({g: g_id, d: d_id});
    var gcli = wslist.findIndex(w => {
      return w.id == g_id;
    });
    var dcli = wslist.findIndex(w => {
      return w.id == d_id;
    });
    wslist[gcli].pair = d_id;
    wslist[dcli].pair = g_id;
    var mes = {
      event: "findOpponent",
      date: getDate()
    }
    var mesStr = JSON.stringify(mes);
    wslist[gcli].ws.send(mesStr);
    wslist[dcli].ws.send(mesStr);
    console.log("matching client");
    console.log("Guest:"+g_id+" to Driver:"+d_id);
    console.log(chatpair);
    console.log(wslist);
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