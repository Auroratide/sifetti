import type { Test } from 'uvu'
import { ComponentPath, CompiledComponent, compile } from './compile'

type Context = Record<string, any>

export type ComponentContext = {
    component: CompiledComponent,
}

export const withComponent = <T extends Context = Context>(p: ComponentPath) => (test: Test<T>): Test<T & ComponentContext> => {
    (test as Test<T & ComponentContext>).before(async (context) => {
        try {
            context.component = await compile(p)
        } catch (err) {
            console.error('Failed to compile component: ', err)
            throw err
        }
    })
    
    return test as Test<T & ComponentContext>
}
