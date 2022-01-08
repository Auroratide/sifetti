import type { DOMWindow } from 'jsdom'
import { marked } from 'marked'
import createDomPurify from 'dompurify'

export type Parser = (md: string) => string

let win: Window | DOMWindow = globalThis.window ?? null
let cachedParser: Parser = null

export const parser: () => Promise<Parser> = async () => {
    if (!cachedParser) {
        if (!win) {
            // We need to determine if this is running on the server or not
            // We don't want to bring JSDOM to the browser
            win = new (await import('jsdom')).JSDOM('').window
        }

        cachedParser = (md) => createDomPurify(win as Window).sanitize(marked(md))
    }

    return cachedParser
}
