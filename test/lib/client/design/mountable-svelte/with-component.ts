import type { Test } from 'uvu'
import { ComponentPath, CompiledComponent, compile } from './compile'

type Context = Record<string, any>

export type ComponentContext = {
    component: CompiledComponent,
}

export const withComponent = <T extends Context = Context>(p: ComponentPath) => (test: Test<T>): Test<T & ComponentContext> => {
    (test as Test<T & ComponentContext>).before(async (context) => {
        context.component = await compile(p)
    })
    
    return test as Test<T & ComponentContext>
}
