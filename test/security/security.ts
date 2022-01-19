import type { SupabaseClient, Session } from '@supabase/supabase-js'
import type { Test } from 'uvu'
import { createClient } from '@supabase/supabase-js'
import { config } from '../config'
import * as assert from '../assert'

type Context = Record<string, any>

export type SecurityAccountsContext = {
    accounts: Record<keyof typeof config.securityAccounts, {
        id: string,
        session: Session,
        client: SupabaseClient,
    }>,
}

export const withSecurityAccounts = <T extends Context = Context>(test: Test<T>): Test<T & SecurityAccountsContext> => {
    (test as Test<T & SecurityAccountsContext>).before(async (context) => {
        try {
            const accounts = {}
            
            const entries = Object.entries(config.securityAccounts)
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

            context.accounts = accounts as Record<keyof typeof config.securityAccounts, {
                id: string,
                session: Session,
                client: SupabaseClient,
            }>
        } catch (err) {
            console.error(err)
            throw err
        }
    })

    return test as Test<T & SecurityAccountsContext>
}

export type ProvisionerContext = {
    provisioner: SupabaseClient,
}

export const withProvisioner = <T extends Context = Context>(test: Test<T>): Test<T & ProvisionerContext> => {
    (test as Test<T & ProvisionerContext>).before.each((context) => {
        context.provisioner = createClient(config.supabase.url, config.supabase.superkey)
    })

    return test as Test<T & ProvisionerContext>
}