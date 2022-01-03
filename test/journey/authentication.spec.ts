import { test } from 'uvu'
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
} from 'taiko'
import { TestServer } from '../server'
import { peopleInMemory } from '../../src/lib/people/in-memory/people'

let server: TestServer

test.before(async () => {
    server = await TestServer.start()
})

test.after.each(async () => {
    await closeBrowser()
})

test.after(() => {
    server.close()
})

test('authenticating', async () => {
    const Aurora = peopleInMemory.aurora

    await openBrowser()
    await goto(server.endpoint('/me'))

    // I'm not logged in, so redirect to sign in
    assert.equal(await currentURL(), server.endpoint('/sign-in'))
    
    await write(Aurora.email, into(textBox('Email')))
    await write(Aurora.password, into(textBox('Password')))
    await click('Sign In')

    // I am greeted
    assert.ok(await text(`Hi ${Aurora.email}!`).exists(), 'I was not greeted on my profile page ):')
})

test.run()
