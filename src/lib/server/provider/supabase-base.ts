import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { JwtToken } from '../../shared/jwt'
import { createClient } from '@supabase/supabase-js'

export type SupabaseCredentials = {
    url: string,
    key: string,
}

export class SupabaseProvider {
    private creds: SupabaseCredentials
    
    constructor(creds: SupabaseCredentials) {
        this.creds = creds
    }

    withClient = async <T>(fn: (supabase: SupabaseClient) => Promise<T>): Promise<T> => {
        const supabase = this.newClient()
        return fn(supabase)
    }

    withClientForToken = async <T>(token: JwtToken, fn: (supabase: SupabaseClient, user: User) => Promise<T>): Promise<T> => {
        const supabase = this.newClient()
        const session = supabase.auth.setAuth(token)
        const { user } = await supabase.auth.api.getUser(session.access_token)

        if (session && user) {
            return fn(supabase, user)
        } else {
            throw new InvalidTokenError()
        }
    }

    private newClient = () => createClient(this.creds.url, this.creds.key, {
        autoRefreshToken: false,
    })
}

export class InvalidTokenError extends Error {
    constructor() {
        super('Session does not exist for provided token')
    }
}