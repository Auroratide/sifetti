import * as path from 'path'
import { pathToFileURL } from 'url'
import { $, goto, evaluate } from 'taiko'

import type { CompiledComponent } from './compile'

const emptyHtml = pathToFileURL(path.resolve(__dirname, 'empty.html')).toString()

/**
 * Attaches the component to a web page using Taiko
 * 
 * @param component component to mount
 * @param props Props to pass to the component
 */
export const mount = async (component: CompiledComponent, props: object = {}) => {
    await goto(emptyHtml)

    await evaluate($('#root'), (e, args) => {
        const script = document.createElement('script')
        script.type = 'module'
        script.textContent = args.component.js

        script.textContent += `
            new ${args.component.name}({
                target: document.getElementById('root'),
                props: ${JSON.stringify(args.props)},
            })
        `

        document.head.appendChild(script)
    }, {
        args: {
            component,
            props,
        }
    })
}