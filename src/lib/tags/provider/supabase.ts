import type { Tag, TagId } from '../types'
import type { TagsProvider } from './provider'
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js'
import type { JwtToken } from '../../security/jwt'
import {
    TagsProviderError,
    DuplicateTagError,
    EmptyTagError,
    NoteNotFoundError,
    TagNotFoundError,
    TagNotOnNoteError,
} from './error'
import { Postgres } from '../../provider/postgres'
import type { Id as NoteId } from '../../notes/types'
import type { Id as PersonId } from '../../people/types'

export type SupabaseCredentials = {
    url: string,
    key: string,
}

export type RawTag = {
    id: TagId,
    author_id: PersonId,
    name: string,
}

type RawNoteTag = {
    note_id: NoteId,
    tag_id: TagId,
}

type NoteTagSelect = {
    note_id: NoteId,
    tags: RawTag,
}

export class SupabaseTagsProvider implements TagsProvider {
    private creds: SupabaseCredentials

    constructor(creds: SupabaseCredentials) {
        this.creds = creds
    }

    create = (token: string, name: string): Promise<TagId> => {
        if (name.length <= 0)
            throw new EmptyTagError()

        return this.withSession(token, async (supabase, user) => {
            const { data, error } = await supabase.from<RawTag>('tags').insert({
                author_id: user.id,
                name: name,
            }).single()

            if (error) {
                if (error.code === Postgres.ErrorCode.UniqueViolation)
                    throw new DuplicateTagError(name)
                else
                    throw new TagsProviderError('Error creating new tag')
            }

            return data.id
        })
    }

    getAll = (token: string): Promise<Tag[]> =>
        this.withSession(token, async (supabase, user) => {
            const { data } = await supabase.from<RawTag>('tags').select()

            return data.map(this.toTag)
        })

    addToNote = (token: string, tag: TagId, note: NoteId): Promise<void> =>
        this.withSession(token, async (supabase, user) => {
            const { error } = await supabase.from<RawNoteTag>('note_tags').insert({
                note_id: note,
                tag_id: tag,
            })

            if (error) {
                if (error.code === Postgres.ErrorCode.ForeignKeyViolation && error.details.includes('"notes"')) {
                    throw new NoteNotFoundError(note)
                } else if (error.code === Postgres.ErrorCode.ForeignKeyViolation && error.details.includes('"tags"')) {
                    throw new TagNotFoundError(tag)
                } else {
                    throw new TagsProviderError('Error adding tag to note')
                }
            }
        })

    getForNote = (token: string, note: NoteId): Promise<Tag[]> =>
        this.withSession(token, async (supabase, user) => {
            const { data, error } = await supabase.from<NoteTagSelect>('note_tags')
                .select('note_id, tags( id, author_id, name )')
                .eq('note_id', note)

            if (error) {
                throw new TagsProviderError('Error getting tags for note')
            }

            return data.map(raw => this.toTag(raw.tags))
        })

    removeFromNote = (token: string, tag: TagId, note: NoteId): Promise<void> =>
        this.withSession(token, async (supabase, user) => {
            const { data, error } = await supabase.from<RawNoteTag>('note_tags')
                .delete()
                .eq('note_id', note)
                .eq('tag_id', tag)

            if (data?.length === 0) {
                throw new TagNotOnNoteError(tag, note)
            }

            if (error) {
                throw new TagsProviderError('Error removing tag from note')
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

    private toTag = (raw: RawTag): Tag => ({
        id: raw.id,
        author: raw.author_id,
        name: raw.name,
    })
}
