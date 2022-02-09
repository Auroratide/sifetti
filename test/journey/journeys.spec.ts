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
    goBack,
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

const testEditingNote = async (noteTitle: string) => {
    // I already have a note
    await click(link(noteTitle))
    assert.ok(await text(noteTitle).exists(), 'I was not taken to the note page')

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
}

test('editing my note', async ({ server }) => {
    const Aurora = peopleInMemory.aurora

    await signIn(server, Aurora)
    await goto(server.endpoint('/me'))

    await testEditingNote('Borealis')

    // The content is saved
    await reload()
    assert.ok(await listItem('My first list item').exists(), 'My edit did not get saved')
    assert.ok(await listItem('My third list item').exists(), 'My edit did not get saved')
})

test('editing a demo note', async ({ server }) => {
    await goto(server.endpoint('/demo'))

    await testEditingNote('Azurin')
})

const testEditingTags = async (noteTitle: string, tagsToEdit: {
    add: string,
    remove: string,
    create: string,
}) => {
    // I already have a note
    await click(link(noteTitle))
    assert.ok(await text(noteTitle).exists(), 'I was not taken to the note page')

    // Adding a tag
    await click(button('+'))
    await click(button(tagsToEdit.add))
    assert.ok(await listItem(tagsToEdit.add, above(text('Add or Remove Tags'))).exists(), 'The tag was not added')

    // Removing a tag
    await click(button(tagsToEdit.remove))
    assert.not.ok(await listItem(tagsToEdit.remove, above(text('Add or Remove Tags'))).exists(0, 0), 'The tag was not removed')

    // Creating a new tag
    await write(tagsToEdit.create, into(textBox('Filter Tags')))
    await click(button('New Tag'))
    assert.ok(await listItem(tagsToEdit.create, above(text('Add or Remove Tags'))).exists(), 'The tag was not created')

    // This is reflected on my page
    await goBack()
    const tags = await $(`[aria-label="${noteTitle}"] .tag-list li`).elements()
    assert.equal(tags.length, 2)
    for (let tag of tags) {
        assert.ok([tagsToEdit.create, tagsToEdit.add].includes(await tag.text()), 'Tag not visible on note')
    }
}
test('editing my tags', async ({ server }) => {
    const Aurora = peopleInMemory.aurora

    await signIn(server, Aurora)
    await goto(server.endpoint('/me'))

    await testEditingTags('Australis', {
        add: 'visited',
        remove: 'natural',
        create: 'alien',
    })
})

test('editing demo tags', async ({ server }) => {
    await goto(server.endpoint('/demo'))

    await testEditingTags('Azurin', {
        add: 'character',
        remove: 'city',
        create: 'warm',
    })
})

test.run()
