import * as path from 'path'
import { rollup } from 'rollup'
import svelte from 'rollup-plugin-svelte'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import cssRu from 'rollup-plugin-css-only'
import preprocess from 'svelte-preprocess'
import alias from '@rollup/plugin-alias'

export type CompiledComponent = {
    name: string,
    js: string,
    css: string,
}

export type ComponentPath = {
    name: string,
    path: string,
}

export const lib = (...p: string[]) => ({
    name: p[p.length - 1],
    path: path.resolve('src', 'lib', 'client', ...p.slice(0, p.length - 1), `${p[p.length - 1]}.svelte`)
})

export const local = (dirname: string, ...p: string[]) => ({
    name: p[p.length - 1],
    path: path.resolve(dirname, ...p.slice(0, p.length - 1), `${p[p.length - 1]}.svelte`),
})

/**
 * Converts a svelte file into JS and CSS that can be mounted via Taiko.
 * Rollup is used to bundle Svelte's runtime with the code; this way,
 * components can be mounted without needing to start an actual server.
 * 
 * @param p path to the file
 * @returns The component's name, js, and css code
 */
export const compile = async (p: ComponentPath): Promise<CompiledComponent> => {
    const name = p.name
    const file = p.path

    const bundle = await rollup({
        input: file,
        plugins: [
            alias({
                entries: [ {
                    find: '$lib',
                    replacement: path.resolve('src', 'lib'),
                } ],
            }),
            svelte({
                preprocess: preprocess()
            }),
            cssRu({
                output: 'bundle.css',
            }) as any,
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