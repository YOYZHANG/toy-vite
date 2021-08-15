"use strict";
exports.__esModule = true;
exports.sendJSStream = exports.sendJS = exports.send = void 0;
var fs_1 = require("fs");
function send(res, source, mime) {
    res.setHeader('Content-Type', mime);
    res.end(source);
}
exports.send = send;
function sendJS(res, source) {
    send(res, source, 'application/javascript');
}
exports.sendJS = sendJS;
function sendJSStream(res, filename) {
    res.setHeader('Content-Type', 'application/javascript');
    var stream = fs_1["default"].createReadStream(filename);
    stream.on('open', function () {
        stream.pipe(res);
    });
    stream.on('error', function (err) {
        res.end(err);
    });
}
exports.sendJSStream = sendJSStream;
