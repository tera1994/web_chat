'use strict';

var localStream;

// カメラ映像取得
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
  // 成功時にvideo要素にカメラ映像をセットし、再生
  var videoElm = document.getElementById('my-video');
  videoElm.srcObject = stream;
  videoElm.play();
  // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
  localStream = stream;
}).catch(function (error) {
  // 失敗時にはエラーログを出力
  console.error('mediaDevice.getUserMedia() error:', error);
  return;
});

//Peer作成
var peer = new Peer({
  key: 'dbe279a6-9574-4878-ad0d-4f0f710fbd4a',
  debug: 3
});
peer.on('open', function () {
  document.getElementById('my-id').textContent = peer.id;
});

// 発信処理
document.getElementById('make-call').onclick = function () {
  var theirID = document.getElementById('their-id').value;
  var mediaConnection = peer.call(theirID, localStream);
  setEventListener(mediaConnection);
};
// イベントリスナを設置する関数
var setEventListener = function setEventListener(mediaConnection) {
  mediaConnection.on('stream', function (stream) {
    // video要素にカメラ映像をセットして再生
    var videoElm = document.getElementById('their-video');
    videoElm.srcObject = stream;
    videoElm.play();
  });
};

//着信処理
peer.on('call', function (mediaConnection) {
  mediaConnection.answer(localStream);
  setEventListener(mediaConnection);
});

//エラー処理
peer.on('error', function (err) {
  alert(err.message);
});

peer.on('connection', function (conn) {
  document.getElementById('my-id').textContent = document.getElementById('my-id').textContent + conn;
});

peer.on('disconnected', function (id) {
  document.getElementById('my-id').textContent = document.getElementById('my-id').textContent + conn;
});
