let ws = new WebSocket('ws://localhost:5001')

// 接続時に呼ばれる
ws.addEventListener('open', e => {
    console.log('open')
})

// サーバからのデータ受信時に呼ばれる
ws.addEventListener('message', e => {
    //document.getElementById("span1").textContent += e.data;
    document.getElementById('wrap').innerHTML += (e.data+"</br>");
})

function send_text() {
    let input_message = document.getElementById("input_message").value;
    ws.send(input_message);

    document.getElementById('wrap').innerHTML += (input_message+"</br>");
    document.getElementById("input_message").value = "";
}