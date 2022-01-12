import { suite } from 'uvu'
import {
    openBrowser,
    closeBrowser,
    listItem,
    write,
    into,
    textBox,
    clear,
} from 'taiko'
import * as assert from '../../../assert'
import { withComponent, local, mount } from '../../design/mountable-svelte'

const test = withComponent(local(__dirname, 'TagFilterFixture'))(suite('TagFilter Component'))

test.before(async () => {
    await openBrowser()
})

test.after(async () => {
    await closeBrowser()
})

test('filtering', async ({ component }) => {
    await mount(component, {
        tags: [ {
            id: '1',
            author: '1',
            name: 'hello',
        }, {
            id: '2',
            author: '1',
            name: 'world',
        } ]
    })

    assert.ok(await listItem('hello').exists(), 'hello was not listed')
    assert.ok(await listItem('world').exists(), 'world was not listed')

    await write('he', into(textBox('Filter Tags')))
    assert.ok(await listItem('hello').exists(), 'hello was not listed')
    assert.ok(!await listItem('world').exists(0, 0), 'world should have been filtered out')

    await clear(textBox('Filter Tags'))
    await write('wo', into(textBox('Filter Tags')))
    assert.ok(!await listItem('hello').exists(0, 0), 'hello should have been filtered out')
    assert.ok(await listItem('world').exists(), 'world was not listed')

    await write('rm', into(textBox('Filter Tags')))
    assert.ok(!await listItem('hello').exists(0, 0), 'hello should have been filtered out')
    assert.ok(!await listItem('world').exists(0, 0), 'world should have been filtered out')
})

test.run()