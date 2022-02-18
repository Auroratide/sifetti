import { suite } from 'uvu'
import {
    openBrowser,
    closeBrowser,
    text,
    title,
} from 'taiko'
import * as assert from '../../../assert'
import { withComponent, lib, mount } from './mountable-svelte'

const test = withComponent(lib('design', 'atom', 'Title'))(suite('Title Component'))

test.before(async () => {
    await openBrowser()
})

test.after(async () => {
    await closeBrowser()
})

test('as prop', async ({ component }) => {
    await mount(component, {
        value: 'The Title'
    })
    assert.ok(await text('The Title').exists(), 'Title was not in text')
    assert.match(await title(), 'The Title', 'Title was not in <title>')
})

test('as slot', async ({ component }) => {
    await mount(component, {
        value: 'The Title'
    }, {
        default: '<strong>Strong</strong>'
    })
    assert.ok(await text('Strong').exists(), 'Title was not in text')
    assert.match(await title(), 'The Title', 'Title was not in <title>')
})

test.run()