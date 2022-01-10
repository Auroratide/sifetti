import * as path from 'path'
import { rollup } from 'rollup'
import svelte from 'rollup-plugin-svelte'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import cssRu from 'rollup-plugin-css-only'
import preprocess from 'svelte-preprocess'

export type CompiledComponent = {
    name: string,
    js: string,
    css: string,
}

/**
 * Converts a svelte file into JS and CSS that can be mounted via Taiko.
 * Rollup is used to bundle Svelte's runtime with the code; this way,
 * components can be mounted without needing to start an actual server.
 * 
 * @param p path to the file (src/lib/...p)
 * @returns The component's name, js, and css code
 */
export const compile = async (...p: string[]): Promise<CompiledComponent> => {
    const name = p[p.length - 1]
    const file = path.resolve('src', 'lib', ...p.slice(0, p.length - 1), `${name}.svelte`)

    const bundle = await rollup({
        input: file,
        plugins: [
            svelte({
                preprocess: preprocess()
            }),
            cssRu({
                output: 'bundle.css',
            }),
            resolve({
                browser: true,
                dedupe: ['svelte'],
            }),
            commonjs(),
            typescript({
                sourceMap: false,
            }),
        ]
    })

    const { output } = await bundle.generate({})

    let js = ''
    let css = ''

    output.forEach(it => {
        if (it.type === 'chunk' && it.facadeModuleId === file)
            js = it.code
        else if (it.type === 'asset' && it.fileName === 'bundle.css')
            css = it.source.toString()
    })

    await bundle.close()

    return {
        name,
        js,
        css,
    }
}