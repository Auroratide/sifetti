import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import {
    $,
    openBrowser,
    goto,
    closeBrowser,
    currentURL,
    write,
    into,
    textBox,
    click,
    text,
    button,
    link,
    listItem,
    doubleClick,
    press,
    reload,
    above,
    below,
    waitFor,
} from 'taiko'
import { withTestServer } from '../server'
import { peopleInMemory } from '../../src/lib/people/in-memory/people'
import { signIn } from './actions'

const test = withTestServer(suite('Journeys', {}))

const headless = true

test.before(async () => {
    await openBrowser({ headless })
})

test.after(async () => {
    await closeBrowser()
})

test('authenticating', async ({ server }) => {
    const Aurora = peopleInMemory.aurora

    await goto(server.endpoint('/me'))

    // I'm not logged in, so redirect to sign in
    assert.match(await currentURL(), server.endpoint('/sign-in'))
    
    await write(Aurora.email, into(textBox('Email')))
    await write(Aurora.password, into(textBox('Password')))
    await click(button('Sign In'))

    // I am greeted
    assert.ok(await text(Aurora.email).exists(), 'I was not greeted on my profile page ):')
})

test('editing a note', async ({ server }) => {
    const Aurora = peopleInMemory.aurora

    await signIn(server, Aurora)
    await goto(server.endpoint('/me'))

    // I already have a note called Borealis
    await click(link('Borealis'))
    assert.ok(await text('Borealis').exists(), 'I was not taken to the Borealis note page')

    // Clicking Edit and Save
    await click(button('Edit'))
    await write('\n* My first list item\n* My second list item\n', into(textBox('Content')))
    await click(button('Save'))
    assert.ok(await listItem('My first list item').exists(), 'My edit did not get formatted')

    // Double clicking and unfocusing
    await doubleClick(listItem('My second list item'))
    await write('\n* My third list item\n', into(textBox('Content')))
    await press('Tab')
    assert.ok(await listItem('My third list item').exists(), 'My edit did not get formatted')
    
    // The content is saved
    await reload()
    assert.ok(await listItem('My first list item').exists(), 'My edit did not get saved')
    assert.ok(await listItem('My third list item').exists(), 'My edit did not get saved')
})

test('editing tags', async ({ server }) => {
    const Aurora = peopleInMemory.aurora

    await signIn(server, Aurora)
    await goto(server.endpoint('/me'))

    // I already have a note called Australis
    await click(link('Australis'))
    assert.ok(await text('Australis').exists(), 'I was not taken to the Australis note page')

    // Yay! I've seen Aurora Australis now...
    await click(button('+'))
    await click(button('visited'))
    assert.ok(await listItem('visited', above(text('Add or Remove Tags'))).exists(), 'The visited tag was not added')

    // But maybe Australis is caused by aliens!
    await click(button('natural'))
    assert.not.ok(await listItem('natural', above(text('Add or Remove Tags'))).exists(0, 0), 'The natural tag was not removed')

    // Let's add a new tag stating that
    await write('alien', into(textBox('Filter Tags')))
    await click(button('New Tag'))
    assert.ok(await listItem('alien', above(text('Add or Remove Tags'))).exists(), 'The alien tag was not added')

    // This is reflected on the profile page
    await click(link('My Page'))
    const tags = await $('[aria-label="Australis"] .tag-list li').elements()
    assert.equal(tags.length, 2)
    for (let tag of tags) {
        assert.ok(['alien', 'visited'].includes(await tag.text()), 'Tag not visible on note')
    }
})

test.run()
