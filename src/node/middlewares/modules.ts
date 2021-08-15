import resolve from 'resolve-from'
import { sendJSStream } from '../util'
import { promises as fs, createReadStream } from 'fs'
import path from 'path'
import { init as initLexer, parse } from 'es-module-lexer'
import MagicString from 'magic-string'

export function moduleResolverMiddleware({cwd, app}) {
    let modulePath: string;

    app.use(async (ctx, next) => {
        await next()

        if (ctx.url === '/index.html') {
        const html = await readStream(ctx.body)
        await initLexer
        ctx.body = html.replace(
            /(<script\b[^>]*>)([\s\S]*?)<\/script>/gm,
            (_, openTag, script) => {
            return `${openTag}${rewriteImports(script)}</script>`
            }
        )
        }


        if (
            ctx.response.is('js') &&
            // skip dependency modules
            !ctx.path.startsWith(`/__`) &&
            // only need to rewrite for <script> part in vue files
            !(ctx.path.endsWith('.vue') && ctx.query.type != null)
          ) {
            await initLexer
            ctx.body = rewriteImports(await readStream(ctx.body))
          }

    })
 }

 async function readStream(stream: Readable | string): Promise<string> {
    if (stream instanceof Readable) {
      return new Promise((resolve, reject) => {
        let res = ''
        stream
          .on('data', (chunk) => (res += chunk))
          .on('error', reject)
          .on('end', () => {
            resolve(res)
          })
      })
    } else {
      return stream
    }
  }
  
  function rewriteImports(source: string) {
    const [imports] = parse(source)
  
    if (imports.length) {
      const s = new MagicString(source)
      let hasReplaced = false
      imports.forEach(({ s: start, e: end, d: dynamicIndex }) => {
        const id = source.substring(start, end)
        if (dynamicIndex < 0) {
          if (/^[^\/\.]/.test(id)) {
            s.overwrite(start, end, `/__modules/${id}`)
            hasReplaced = true
          }
        } else {
          // TODO dynamic import
        }
      })
      return hasReplaced ? s.toString() : source
    }
  
    return source
  }
