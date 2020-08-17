let myID;
let ws = new WebSocket('ws://localhost:8081')
let btn
window.onload = function(){
btn = document.getElementById("b1");
btn.disabled = "disabled";};

// サーバからのデータ受信時に呼ばれる
ws.onmessage = function (event) {
    let msg = JSON.parse(event.data);
    let time = new Date(msg.date);
    let timeStr = time.toLocaleTimeString();

    switch (msg.event) {
        case "findOpponent":
            document.getElementById('wrap').innerHTML = "チャット相手が見つかりました</br>";
            btn.disabled = ""
            break;
        case "receiveMes":
            document.getElementById('wrap').innerHTML += ("<div class=\"says\"><p>" + msg.data + "</p></div></br>");
            break;
        case "endedChat":
            document.getElementById('wrap').innerHTML ="通信が切れました" + "</br>" + "新しい相手を探します"+"</br>";
            btn.disabled = "disabled"
            let find_opp_msg_end = {
                event: "searchOpponent",
                date: Date.now(),
                clientId: myID
            };
            ws.send(JSON.stringify(find_opp_msg_end));
            break;
        case "yourID":
            myID = msg.data;
            let find_opp_msg = {
                event: "searchOpponent",
                date: Date.now(),
                clientId: myID
            };
            document.getElementById('wrap').innerHTML ="チャット相手を探しています"+"</br>";
            btn.disabled = "disabled"
            ws.send(JSON.stringify(find_opp_msg));
            
            break;
    }
};

function send_text() {
    let input_message = document.getElementById("input_message").value;
    if (input_message === ""){
        return
    }
    document.getElementById('wrap').innerHTML += ("<div class=\"mycomment\"><p>" + input_message + "</p></div>");
    let msg = {
        event: "sendMes",
        data: input_message,
        date: Date.now(),
        clientId: myID
    };
    ws.send(JSON.stringify(msg));
    document.getElementById("input_message").value = "";
}

function stop_chat() {
    let msg = {
        event: "endChat",
        date: Date.now(),
        clientId: myID
    };
    ws.send(JSON.stringify(msg));
    ws.close();
    window.location.href = "/";
}