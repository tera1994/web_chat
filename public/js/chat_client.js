let myID;
let ws = new WebSocket('ws://localhost:5001')


// サーバからのデータ受信時に呼ばれる
ws.onmessage = function (event) {
    let msg = JSON.parse(event.data);
    let time = new Date(msg.date);
    let timeStr = time.toLocaleTimeString();

    switch (msg.event) {
        case "findOpponent":
            break;
        case "receiveMes":
            document.getElementById('wrap').innerHTML += (msg.data + "</br>");
            break;
        case "endedChat":

            break;
        case "yourID":
            myID = msg.data;
            let find_opp_msg = {
                event: "searchOpponent",
                date: Date.now(),
                clientId: myID
            };
            ws.send(JSON.stringify(msg));
            break;
    }
};

function send_text() {
    let input_message = document.getElementById("input_message").value;
    let msg = {
        event: "sendMes",
        data: input_message,
        date: Date.now(),
        clientId: myID
    };
    ws.send(JSON.stringify(msg));

    document.getElementById('wrap').innerHTML += (input_message + "</br>");
    document.getElementById("input_message").value = "";
}