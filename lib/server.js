const ws = require('ws');
const http = require('http');
const path = require('path');
const url = require('url');
const serve = require('serve-handler');
const fs = require('fs').promises;
// const vue = require('./vueMiddleware');
const {sendJS} = require('./util');
const {createFileWatcher} = require('./file-watcher');
const {rewrite} = require('./moduleRewriter');
const {moduleMiddleware} = require('./moduleMiddleware');

exports.createServer = async({})
const hmr = fs.readFileSync(path.resolve(__dirname, './hmrProxy.js'));

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url).pathname;
    console.log('[DEBUG]pathName', pathName);
    if (pathName === '/__hmrProxy') {
        return sendJS(res, hmr);
    }
    else if (pathName.startsWith('/__modules/')) {
        return moduleMiddleware(pathName.replace('/__modules/',''), res);
    }
    else if (pathName.endsWith('.vue')) {
        // return vue(req, res);
    }
    else if (pathName.endsWith('.mjs') || pathName.endsWith('.js')){
        const filename = path.join(process.cwd(),pathName.slice(1));
        console.log('[DEBUG]filename:', filename);
        if (fs.existsSync(filename)) {
            console.log('[DEBUG]existsSync:', filename);
            const content = rewrite(fs.readFileSync(filename, 'utf-8'));
            console.log('[DEBUG]rewrite:', content);
            return sendJS(res, content);
        }
    }

    serve(req, res, {
        rewrites: [{source: '**', destination: '/index.html'}]
    });
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
    sockets.forEach(socket => {
        console.log(socket);
        socket.send(JSON.stringify(payload));
    });
});


server.listen(3000, () => {
    console.log('Running at http://localhost:3000');
});

