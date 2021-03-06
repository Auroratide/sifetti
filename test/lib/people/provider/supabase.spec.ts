import { suite } from 'uvu'
import { SupabasePeopleProvider } from '../../../../src/lib/server/people/provider/supabase'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from '../../../config'

import { Context, TestPeople, withProvider } from './provider.spec'

const superbase = createClient(config.supabase.url, config.supabase.superkey)
const test = withProvider(
    suite<Context<SupabasePeopleProvider>>('Supabase People Provider'),
    () => new SupabasePeopleProvider({ url: config.supabase.url, key: config.supabase.key })
)

const ensureUserDoesNotExist = async (supabase: SupabaseClient, creds: { email: string, password: string, }) => {
    const { data } = await supabase.auth.api.listUsers()
    const user = data.find(it => it.email === creds.email)

    if (user) {
        const { error } = await supabase.auth.api.deleteUser(user.id)
        if (error) {
            console.error(error)
            throw error
        }
    }
}

test.before.each(async () => {
    await Promise.all(Object.values(TestPeople).map(person => {
        return ensureUserDoesNotExist(superbase, person)
    }))
})

// TODO Eventually, these tests can only run on CI, or by explicit choice
test.run()