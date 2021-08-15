import chokidar from 'chokidar';
import path from 'path'
import {createReadStream} from 'fs'
export interface ServerNotification {
    type: string
    path?: string
}

const hmrClientPath = path.resolve(__dirname, '../../client/client.js')

export const hmrMiddleware: Middleware = ({ cwd, app, server }) => {
    app.use((ctx, next) => {
        if (ctx.path !== '/__hmrProxy') {
            return next()
        }
        ctx.type = 'js'
        ctx.body = createReadStream(hmrClientPath)
    })

    // start a websocket server to send hmr notifications to the client
    const wss = new WebSocket.Server({ server })
    const sockets = new Set<WebSocket>()

    wss.on('connection', (socket) => {
        sockets.add(socket)
        socket.send(JSON.stringify({ type: 'connected' }))
        socket.on('close', () => {
        sockets.delete(socket)
        })
    })

    wss.on('error', (e: Error & { code: string }) => {
        if (e.code !== 'EADDRINUSE') {
        console.error(e)
        }
    })

    const notify = (payload: HMRPayload) =>
        sockets.forEach((s) => s.send(JSON.stringify(payload)))

    const watcher = chokidar.watch(cwd, {
        ignored: [/node_modules/]
    })

    watcher.on('change', (file) => {
        const send = (payload: HMRPayload) => {
            console.log(`[hmr] ${JSON.stringify(payload)}`)
            notify(payload)
        }
        const resourcePath = '/' + path.relative(cwd, file)
        console.log('[DEBUG] filepath changed', resourcePath);
        send({
            type: 'full-reload'
        });
    })
}