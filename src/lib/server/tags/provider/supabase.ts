import type { Tag, TagId } from '$lib/shared/tags/types'
import type { TagsProvider } from '$lib/shared/tags/types/provider/provider'
import {
    TagsProviderError,
    DuplicateTagError,
    EmptyTagError,
    TagNotOnNoteError,
    NoteOrTagNotFoundError,
    InvalidTagError,
} from '$lib/shared/tags/types/provider/error'
import { Postgres } from '$lib/provider/postgres'
import type { Id as NoteId } from '$lib/shared/notes/types'
import type { Id as PersonId } from '$lib/shared/people/types'
import { SupabaseProvider } from '$lib/provider/supabase-base'
import type { TagName } from '$lib/shared/tags/types/tag-name'

export type RawTag = {
    id: TagId,
    author_id: PersonId,
    name: string,
}
export const toTag = (raw: RawTag): Tag => ({
    id: raw.id,
    author: raw.author_id,
    name: raw.name as TagName,
})

type RawNoteTag = {
    note_id: NoteId,
    tag_id: TagId,
}

type NoteTagSelect = {
    note_id: NoteId,
    tags: RawTag,
}

export class SupabaseTagsProvider extends SupabaseProvider implements TagsProvider {
    create = (token: string, name: TagName): Promise<TagId> => {
        if (name.length <= 0)
            throw new EmptyTagError()

        return this.withClientForToken(token, async (supabase, user) => {
            const { data, error } = await supabase.from<RawTag>('tags').insert({
                author_id: user.id,
                name: name,
            }).single()

            if (error) {
                switch (error.code) {
                    case Postgres.ErrorCode.UniqueViolation: throw new DuplicateTagError(name)
                    case Postgres.ErrorCode.CheckViolation: throw new InvalidTagError(name)
                    default: new TagsProviderError('Error creating new tag')
                }
            }

            return data.id
        })
    }

    getAll = (token: string): Promise<Tag[]> =>
        this.withClientForToken(token, async (supabase) => {
            const { data } = await supabase.from<RawTag>('tags').select()

            return data.map(toTag)
        })

    addToNote = (token: string, tag: TagId, note: NoteId): Promise<void> =>
        this.withClientForToken(token, async (supabase) => {
            const { error } = await supabase.from<RawNoteTag>('note_tags').insert({
                note_id: note,
                tag_id: tag,
            })

            if (error) {
                if (error.code === Postgres.ErrorCode.InsufficientPrivilege) {
                    throw new NoteOrTagNotFoundError(note, tag)
                } else {
                    console.error(error)
                    throw new TagsProviderError('Error adding tag to note')
                }
            }
        })

    getForNote = (token: string, note: NoteId): Promise<Tag[]> =>
        this.withClientForToken(token, async (supabase) => {
            const { data, error } = await supabase.from<NoteTagSelect>('note_tags')
                .select('note_id, tags( id, author_id, name )')
                .eq('note_id', note)

            if (error) {
                throw new TagsProviderError('Error getting tags for note')
            }

            return data.map(raw => toTag(raw.tags))
        })

    removeFromNote = (token: string, tag: TagId, note: NoteId): Promise<void> =>
        this.withClientForToken(token, async (supabase) => {
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
}
