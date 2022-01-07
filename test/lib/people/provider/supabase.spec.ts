import { suite } from 'uvu'
import { SupabasePeopleProvider } from '../../../../src/lib/people/provider/supabase'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from '../../../config'

import { Context, TestPeople, withProvider } from './provider.spec'

const supabase = createClient(config.supabase.url, config.supabase.key)
const test = withProvider(
    suite<Context<SupabasePeopleProvider>>('Supabase People Provider'),
    () => new SupabasePeopleProvider(supabase)
)

const ensureUserDoesNotExist = async (supabase: SupabaseClient, creds: { email: string, password: string, }) => {
    const { user } = await supabase.auth.signIn(creds)

    if (user) {
        const { error } = await supabase.auth.api.deleteUser(user.id, config.supabase.superkey)
        if (error) {
            console.error(error)
            throw error
        }
    }
}

test.before.each(async () => {
    await Promise.all(Object.values(TestPeople).map(person => {
        return ensureUserDoesNotExist(supabase, person)
    }))
})

// TODO Eventually, these tests can only run on CI, or by explicit choice
test.run()