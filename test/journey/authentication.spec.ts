import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import {
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
} from 'taiko'
import { withTestServer } from '../server'
import { peopleInMemory } from '../../src/lib/people/in-memory/people'

const test = withTestServer(suite('Authentication Journey', {}))

test.after.each(async () => {
    await closeBrowser()
})

test('authenticating', async ({ server }) => {
    const Aurora = peopleInMemory.aurora

    await openBrowser()
    await goto(server.endpoint('/me'))

    // I'm not logged in, so redirect to sign in
    assert.match(await currentURL(), server.endpoint('/sign-in'))
    
    await write(Aurora.email, into(textBox('Email')))
    await write(Aurora.password, into(textBox('Password')))
    await click(button('Sign In'))

    // I am greeted
    assert.ok(await text(Aurora.email).exists(), 'I was not greeted on my profile page ):')
})

test.run()
