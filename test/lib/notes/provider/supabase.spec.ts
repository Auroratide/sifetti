import { suite } from 'uvu'
import { SupabaseNotesProvider } from '../../../../src/lib/server/notes/provider/supabase'
import type { JwtToken } from '../../../../src/lib/security/jwt'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from '../../../config'

import { TestPeople, Context, withProvider } from './provider.spec'

const test = withProvider(
    suite<Context<SupabaseNotesProvider>>('Supabase Notes Provider'),
    () => new SupabaseNotesProvider({
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

const ensureUserHasNoNotes = async (supabase: SupabaseClient, person: JwtToken) => {
    const session = await supabase.auth.setAuth(person)
    const { user } = await supabase.auth.api.getUser(session.access_token)
    const { error } = await supabase.from('notes').delete().eq('user_id', user.id)

    if (error) {
        throw error
    }
}

test.before.each(async (context) => {
    context.tokens = {
        Cay: '',
        Antler: '',
    }

    await Promise.all(Object.entries(TestPeople).map(([name, person]) => {
        const supabase = createClient(config.supabase.url, config.supabase.superkey)
        return ensureUserExists(supabase, person)
            .then(token => context.tokens[name] = token)
            .then(() => ensureUserHasNoNotes(supabase, context.tokens[name]))
    })).catch(err => {
        console.error(err)
        throw err
    })
})

// TODO Eventually, these tests can only run on CI, or by explicit choice
test.run()
