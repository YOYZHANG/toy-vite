const ws = require('ws');
const http = require('http');
const path = require('path');
const url = require('url');
const serve = require('serve-handler');
const fs = require('fs');
const {sendJS} = require('./util');
const {createFileWatcher} = require('./file-watcher');

const hmr = fs.readFileSync(path.resolve(__dirname, './hmrProxy.js'));

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url).pathname;
    console.log('[DEBUG]pathName', pathName);
    if (pathName === '/__hmrProxy') {
        sendJS(res, hmr);
    }
    else {
        serve(req, res);
    }
});

const sockets = new Set();
const wss = new ws.Server({server});
wss.on('connection', socket => {
    console.log('[connection]');
    sockets.add(socket);

    socket.send(JSON.stringify({type: 'connection'}));
    socket.on('close', () => {
        sockets.delete(socket);
    })
});

createFileWatcher((payload) => {
    console.log('[DEBUG]: send change', payload);
    sockets.forEach(socket => {
        console.log(socket);
        socket.send(JSON.stringify(payload));
    });
});


server.listen(3000, () => {
    console.log('Running at http://localhost:3000');
});

