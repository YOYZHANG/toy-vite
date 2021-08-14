
function send(res, source, mime) {
    res.setHeader('Content-Type', mime);
    res.end(source);
}

exports.sendJS = function(res, source) {
    send(res, source, 'application/javascript');
}