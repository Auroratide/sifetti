import { suite } from 'uvu'
import {
    openBrowser,
    closeBrowser,
    text,
} from 'taiko'
import * as assert from '../../assert'
import { CompiledComponent, compile } from './compile'
import { mount } from './mount'

type Context = {
    component: CompiledComponent,
}

const test = suite<Context>('Title Component')

test.before(async (context) => {
    context.component = await compile('design', 'Title')
})

test.after.each(async () => {
    await closeBrowser()
})

test('Title shows', async ({ component }) => {
    await openBrowser()
    await mount(component, {
        title: 'Stuff'
    })
    assert.ok(await text('Stuff').exists())
})

test.run()