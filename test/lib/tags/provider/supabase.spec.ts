import { suite } from 'uvu'
import { SupabaseTagsProvider } from '../../../../src/lib/tags/provider/supabase'
import { SupabaseNotesProvider } from '../../../../src/lib/notes/provider/supabase'
import type { JwtToken } from '../../../../src/lib/security/jwt'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from '../../../config'

import { TestPeople, TestNotes, Context, withProvider } from './provider.spec'

const test = withProvider(
    suite<Context<SupabaseTagsProvider>>('Supabase Tags Provider'),
    () => new SupabaseTagsProvider({
        url: config.supabase.url,
        key: config.supabase.key,
    })
)

const ensureUserExists = async (supabase: SupabaseClient, creds: { email: string, password: string, }): Promise<string> => {
    let { session } = await supabase.auth.signIn(creds)

    if (!session) {
        session = (await supabase.auth.signUp(creds)).session
    }

    return session.access_token
}

const ensureUserHasNoTags = async (supabase: SupabaseClient, person: JwtToken) => {
    const session = await supabase.auth.setAuth(person)
    const { user } = await supabase.auth.api.getUser(session.access_token)
    const { error } = await supabase.from('tags').delete().eq('author_id', user.id)

    if (error) {
        throw error
    }
}

const createNotesForUser = async (provider: SupabaseNotesProvider, person: JwtToken, personName: string, notesContext: Record<keyof typeof TestNotes, string>) => {
    const notes = Object.entries(TestNotes).filter(([_, value]) => value.person === personName)
    for (let [ noteName, _ ] of notes) {
        notesContext[noteName] = await provider.createEmpty(person)
    }
}

test.before.each(async (context) => {
    context.tokens = {
        Cay: '',
        Antler: '',
    }

    context.notes = {
        Vercon: '',
    }

    const notesProvider = new SupabaseNotesProvider({ url: config.supabase.url, key: config.supabase.key })
    await Promise.all(Object.entries(TestPeople).map(([name, person]) => {
        const supabase = createClient(config.supabase.url, config.supabase.superkey)
        return ensureUserExists(supabase, person)
            .then(token => context.tokens[name] = token)
            .then(() => ensureUserHasNoTags(supabase, context.tokens[name]))
            .then(() => createNotesForUser(notesProvider, context.tokens[name], name, context.notes))
    })).catch(err => {
        console.error(err)
        throw err
    })
})

// TODO Eventually, these tests can only run on CI, or by explicit choice
test.run()
