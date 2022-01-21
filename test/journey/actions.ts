import {
    goto,
    write,
    into,
    textBox,
    click,
    button,
} from 'taiko'
import type { TestServer } from '../server'

export const signIn = async (server: TestServer, person: { email: string, password: string, }) => {
    await goto(server.endpoint('/sign-in'))
    await write(person.email, into(textBox('Email')))
    await write(person.password, into(textBox('Password')))
    await click(button('Sign In'))
}