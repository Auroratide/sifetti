import * as path from 'path'
import { suite } from 'uvu'
import {
    openBrowser,
    closeBrowser,
    text,
} from 'taiko'
import * as assert from '../../../assert'
import { mount, withComponent } from '.'

const test = withComponent({
    name: 'TestComponent',
    path: path.resolve(__dirname, 'TestComponent.svelte'),
})(suite('Mountable Svelte'))

test.after.each(async () => {
    await closeBrowser()
})

test('Title shows', async ({ component }) => {
    await openBrowser()
    await mount(component, {
        text: 'Aurora'
    })

    assert.ok(await text('Aurora').exists())
})

test.run()