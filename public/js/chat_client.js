let ws = new WebSocket('ws://localhost:5001')

// 接続時に呼ばれる
ws.addEventListener('open', e => {
    console.log('open')
})

// サーバからのデータ受信時に呼ばれる
ws.addEventListener('message', e => {
    document.getElementById("span1").textContent += e.data;
})

function send_text() {
    let input_message = document.getElementById("input_message").value;
    ws.send(input_message);
    document.getElementById("span1").textContent += input_message + '\n';
    document.getElementById("input_message").value = "";
}