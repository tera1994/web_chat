"use strict";

var express = require("express");
var app = express();

app.use(express.static('./'));

app.get("/", function(req, res) {
    res.sendFile(__dirname+'/main.html');
});

// DO NOT DO app.listen() unless we're testing this directly
if (require.main === module) {
    app.listen(3000);
}

// Instead do export the app:
module.exports = app;