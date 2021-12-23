import type { Person } from '../types'
import type { Credentials, PeopleProvider } from './provider'
import { DuplicatePersonError } from './provider'
import type { Session, SupabaseClient } from '@supabase/supabase-js'

export class SupabasePeopleProvider implements PeopleProvider {
    private client: SupabaseClient

    constructor(client: SupabaseClient) {
        this.client = client
    }

    createNew = async (creds: Credentials): Promise<Person> => {
        const { session, error } = await this.client.auth.signUp(creds)

        if (error) {
            if (error.message.includes('already registered')) {
                throw new DuplicatePersonError(creds.email)
            }

            throw new Error(error.message)
        }
        
        return this.toPerson(session)
    }

    authenticate = async (creds: Credentials): Promise<Person | null> => {
        const { session, error } = await this.client.auth.signIn(creds)

        if (error) {
            if (!error.message.includes('Invalid login')) {
                throw new Error(error.message)
            }
        }

        if (session) {
            return this.toPerson(session)
        } else {
            return null
        }
    }

    private toPerson = (session: Session): Person => ({
        id: session.user.id,
        email: session.user.email,
        token: session.access_token,
    })
}