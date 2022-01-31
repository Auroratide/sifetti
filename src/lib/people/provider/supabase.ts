import type { JwtToken } from '$lib/security/jwt'
import type { Access, Person } from '../types'
import type { Credentials, PeopleProvider, ProfileInfo } from './provider'
import { DuplicatePersonError } from './provider'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { NameTakenError } from './error'
import type { ProfileName } from '../profile-name'
import { InvalidTokenError, SupabaseProvider } from '../../provider/supabase-base'

type PeopleRow = {
    id: string,
    unique_name: string,
}

export class SupabasePeopleProvider extends SupabaseProvider implements PeopleProvider {
    createNew = (creds: Credentials, info: ProfileInfo): Promise<Person> =>
        this.withClient(async (supabase) => {
            if (info.name !== undefined) {
                await this.checkNameAvailability(supabase, info.name)
            }

            const { session, error } = await supabase.auth.signUp(creds)

            if (error) {
                if (error.message.includes('already registered')) {
                    throw new DuplicatePersonError(creds.email)
                }

                throw new Error(error.message)
            }

            await supabase.from<PeopleRow>('people').update({
                unique_name: info.name,
            })
            
            return this.toPerson(session, info.name)
        })

    authenticate = (creds: Credentials): Promise<Access | null> =>
        this.withClient(async (supabase) => {
            const { session, error } = await supabase.auth.signIn(creds)

            if (error) {
                if (!error.message.includes('Invalid login')) {
                    throw new Error(error.message)
                }
            }
    
            if (session) {
                return {
                    token: session.access_token,
                    expires: new Date(session.expires_at * 1000), // given in seconds
                }
            } else {
                return null
            }
        })

    getByToken = (token: JwtToken): Promise<Person | null> =>
        this.withClientForToken(token, async (supabase, user) => {
            return {
                id: user.id,
                email: user.email,
            }
        }).catch(err => {
            if (err instanceof InvalidTokenError)
                return null
            else
                throw err
        })

    invalidate = (token: JwtToken): Promise<void> =>
        this.withClientForToken(token, async (supabase) => {
            await supabase.auth.api.signOut(token)
        })

    resetPassword = (token: string, newPassword: string): Promise<void> =>
        this.withClientForToken(token, async (supabase) => {
            const { error } = await supabase.auth.update({ password: newPassword })
            if (error) {
                throw new Error(error.message)
            }
        })

    private toPerson = (session: Session, name?: ProfileName): Person => ({
        id: session.user.id,
        email: session.user.email,
        name: name,
    })

    private checkNameAvailability = async (supabase: SupabaseClient, name: ProfileName) => {
        const { data } = await supabase.from<PeopleRow>('people')
            .select()
            .ilike('unique_name', name)

        if (data.length > 0) {
            throw new NameTakenError(name)
        }
    }
}