"use strict";
exports.__esModule = true;
var express_1 = require("express");
var app = (0, express_1["default"])();
var port = 3000;
// настраиваем приложение , реагировать на запрос
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.get('/samurais', function (req, res) {
    var a = 4;
    if (a > 5) {
        res.send('OK');
    }
    else {
        res.send('Hello Word!');
    }
});
app.post('/samurais', function (req, res) {
    res.send('Hih');
});
// слушай порт и извести по старту программы 
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
