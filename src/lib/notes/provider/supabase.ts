import type { Note, EditableContent, WithTags } from '../types'
import type { RawTag } from '../../tags/provider/supabase'
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

type RawTagsJoin = {
    note_tags: {
        tags: RawTag,
    }[]
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

    getAll = async (token: JwtToken): Promise<(Note & WithTags)[]> =>
        this.withSession(token, async (supabase, user) => {
            const { data } = await supabase.from<RawNote & RawTagsJoin>('notes')
                .select('*, note_tags(tags(*))')

            return data.map(it => ({
                id: it.id,
                author: it.user_id,
                title: it.title,
                content: it.content,
                tags: it.note_tags.map(nt => ({
                    id: nt.tags.id,
                    author: nt.tags.author_id,
                    name: nt.tags.name,
                }))
            }))
        })
    
    replaceContent = async (id: string, token: string, content: EditableContent): Promise<void> =>
        this.withSession(token, async (supabase, user) => {
            const { status, statusText } = await supabase.from<RawNote>('notes')
                .update({
                    title: content.title,
                    content: content.content
                }).eq('id', id)

            if (400 <= status && status < 500) {
                throw new Error('Note to edit does not exist')
            }
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
