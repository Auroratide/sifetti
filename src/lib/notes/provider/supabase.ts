import type { Note } from '../types'
import type { NotesProvider } from './provider'
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js'
import type { JwtToken } from '../../security/jwt'

export type SupabaseCredentials = {
    url: string,
    key: string,
}

type RawNote = {
    id: string,
    user_id: string,
    title: string,
    content: string,
}

export class SupabaseNotesProvider implements NotesProvider {
    private creds: SupabaseCredentials
    
    constructor(creds: SupabaseCredentials) {
        this.creds = creds
    }

    createEmpty = async (token: JwtToken): Promise<string> =>
        this.withSession(token, async (supabase, user) => {
            const { data } = await supabase.from<RawNote>('notes').insert({
                user_id: user.id,
                title: '',
                content: '',
            }).single()

            return data.id
        })

    findById = async (id: string, token: JwtToken): Promise<Note | null> =>
        this.withSession(token, async (supabase, user) => {
            const { data } = await supabase.from<RawNote>('notes')
                .select()
                .eq('id', id)
                .maybeSingle()

            return data ? this.toNote(data) : null
        })

    getAll = async (token: JwtToken): Promise<Note[]> =>
        this.withSession(token, async (supabase, user) => {
            const { data } = await supabase.from<RawNote>('notes')
                .select()

            return data.map(it => this.toNote(it))
        })

    private withSession = async <T>(token: JwtToken, fn: (supabase: SupabaseClient, user: User) => Promise<T>): Promise<T> => {
        const supabase = createClient(this.creds.url, this.creds.key)
        const session = await supabase.auth.setAuth(token)
        const { user } = await supabase.auth.api.getUser(session.access_token)

        if (session && user) {
            return fn(supabase, user)
        } else {
            throw 'no session for token'
        }
    }

    private toNote = (raw: RawNote): Note => ({
        id: raw.id,
        author: raw.user_id,
        title: raw.title,
        content: raw.content,
    })
}
