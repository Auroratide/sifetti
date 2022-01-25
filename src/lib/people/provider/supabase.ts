import type { JwtToken } from '$lib/security/jwt'
import type { Access, Person } from '../types'
import type { Credentials, PeopleProvider, ProfileInfo } from './provider'
import { DuplicatePersonError } from './provider'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { NameTakenError } from './error'
import type { ProfileName } from '../profile-name'

type PeopleRow = {
    id: string,
    unique_name: string,
}

export class SupabasePeopleProvider implements PeopleProvider {
    private client: SupabaseClient

    constructor(client: SupabaseClient) {
        this.client = client
    }

    createNew = async (creds: Credentials, info: ProfileInfo): Promise<Person> => {
        if (info.name !== undefined) {
            await this.checkNameAvailability(info.name)
        }

        const { session, error } = await this.client.auth.signUp(creds)

        if (error) {
            if (error.message.includes('already registered')) {
                throw new DuplicatePersonError(creds.email)
            }

            throw new Error(error.message)
        }

        await this.client.from<PeopleRow>('people').update({
            unique_name: info.name,
        })
        
        return this.toPerson(session, info.name)
    }

    authenticate = async (creds: Credentials): Promise<Access | null> => {
        const { session, error } = await this.client.auth.signIn(creds)

        if (error) {
            if (!error.message.includes('Invalid login')) {
                throw new Error(error.message)
            }
        }

        if (session) {
            return {
                token: session.access_token,
            }
        } else {
            return null
        }
    }

    getByToken = async (token: JwtToken): Promise<Person | null> => {
        const { user } = await this.client.auth.api.getUser(token)

        return user ? {
            id: user.id,
            email: user.email,
        } : null
    }

    invalidate = async (token: JwtToken): Promise<void> => {
        await this.client.auth.api.signOut(token)
    }

    resetPassword = async (token: string, newPassword: string): Promise<void> => {
        this.client.auth.setAuth(token)
        const { error } = await this.client.auth.update({ password: newPassword })
        if (error) {
            throw new Error(error.message)
        }
    }

    private toPerson = (session: Session, name?: ProfileName): Person => ({
        id: session.user.id,
        email: session.user.email,
        name: name,
    })

    private checkNameAvailability = async (name: ProfileName) => {
        const { data } = await this.client.from<PeopleRow>('people')
            .select()
            .ilike('unique_name', name)

        if (data.length > 0) {
            throw new NameTakenError(name)
        }
    }
}