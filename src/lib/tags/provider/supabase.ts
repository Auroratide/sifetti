import type { Tag, TagId } from '../types'
import type { TagsProvider } from './provider'
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js'
import type { JwtToken } from '../../security/jwt'
import { TagsProviderError, DuplicateTagError, EmptyTagError } from './error'
import { Postgres } from '../../provider/postgres'

export type SupabaseCredentials = {
    url: string,
    key: string,
}

type RawTag = {
    id: string,
    author_id: string,
    name: string,
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
