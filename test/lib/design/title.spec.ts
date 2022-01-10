import { suite } from 'uvu'
import {
    openBrowser,
    closeBrowser,
    text,
} from 'taiko'
import * as assert from '../../assert'
import { withComponent, lib, mount } from './mountable-svelte'

const test = withComponent(lib('design', 'Title'))(suite('Title Component'))

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