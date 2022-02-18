import type { SupabaseClient, Session, PostgrestResponse } from '@supabase/supabase-js'
import type { Test } from 'uvu'
import { createClient } from '@supabase/supabase-js'
import { config } from '../config'
import * as assert from '../assert'

type Context = Record<string, any>

export type TestAccountsContext = {
    accounts: Record<keyof typeof config.testAccounts, {
        id: string,
        session: Session,
        client: SupabaseClient,
    }>,
}

export const withTestAccounts = <T extends Context = Context>(test: Test<T>): Test<T & TestAccountsContext> => {
    (test as Test<T & TestAccountsContext>).before(async (context) => {
        try {
            const accounts = {}
            
            const entries = Object.entries(config.testAccounts)
            for (let [ name, info ] of entries) {
                const client = createClient(config.supabase.url, config.supabase.key)
                const { user, session, error } = await client.auth.signIn(info)
                assert.not.ok(error, `Failed to sign in as ${name}`)

                accounts[name] = {
                    id: user.id,
                    session,
                    client,
                }
            }

            context.accounts = accounts as Record<keyof typeof config.testAccounts, {
                id: string,
                session: Session,
                client: SupabaseClient,
            }>
        } catch (err) {
            console.error(err)
            throw err
        }
    })

    return test as Test<T & TestAccountsContext>
}

export type Provisioner = {
    exec: <T>(fn: (client: SupabaseClient) => PromiseLike<PostgrestResponse<T>>) => Promise<PostgrestResponse<T>>
}

export type ProvisionerContext = {
    provisioner: Provisioner,
}

export const withProvisioner = <T extends Context = Context>(test: Test<T>): Test<T & ProvisionerContext> => {
    (test as Test<T & ProvisionerContext>).before.each((context) => {
        const client = createClient(config.supabase.url, config.supabase.superkey)
        client.from('d').select().then(e => {
            e.error
        })
        context.provisioner = {
            exec: async <T>(fn: (client: SupabaseClient) => PromiseLike<PostgrestResponse<T>>): Promise<PostgrestResponse<T>> => {
                const result = await fn(client)

                if (result.error) {
                    console.error(result.error)
                    throw result.error
                }

                return result
            }
        }
    })

    return test as Test<T & ProvisionerContext>
}