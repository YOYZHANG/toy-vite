import resolve from 'resolve-from'
import { sendJSStream } from '../util'
import { promises as fs, createReadStream } from 'fs'
import { rewrite } from '../moduleRewriter'
import path from 'path'

export function moduleResolverMiddleware({cwd, app}) {
    let modulePath: string;

    app.use(async (ctx, next) => {
        if (!ctx.path.endsWith('.js')) {
            return next();
        }

        try {
            const filepath = path.join(cwd, ctx.path.slice(1))
            const raw = await fs.readFile(filepath, 'utf-8')
            ctx.type = 'js'
            ctx.body = rewrite(raw)
        } catch (e) {
            ctx.status = 404
            if (e.code !== 'ENOENT') {
              console.error(e)
            }
        }

    })
 }