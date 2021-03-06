import type { Note, EditableContent, WithTags } from '$lib/shared/notes/types'
import type { RawTag } from '$lib/server/tags/provider/supabase'
import type { NotesProvider } from '$lib/shared/notes/provider/provider'
import type { JwtToken } from '$lib/shared/jwt'
import { toTag } from '$lib/server/tags/provider/supabase'
import { SupabaseProvider } from '$lib/server/provider/supabase-base'
import { MissingNoteError } from '$lib/shared/notes/provider/error'

type NoteTableRow = {
    id: string,
    user_id: string,
    title: string,
    content: string,
    created_at: string,
    updated_at: string,
}
const toNote = (row: NoteTableRow): Note => ({
    id: row.id,
    author: row.user_id,
    title: row.title,
    content: row.content,
    createdAt: new Date(Date.parse(row.created_at)),
    updatedAt: new Date(Date.parse(row.updated_at)),
})

type TagsJoinResult = {
    note_tags: {
        tags: RawTag,
    }[]
}
const toNoteWithTags = (row: NoteTableRow & TagsJoinResult): Note & WithTags => ({
    ...toNote(row),
    tags: row.note_tags.map(it => it.tags).map(toTag),
})

export class SupabaseNotesProvider extends SupabaseProvider implements NotesProvider {
    static NOTES_TABLE_NAME = 'notes'

    createEmpty = (token: JwtToken): Promise<string> =>
        this.withClientForToken(token, async (supabase, user) => {
            const { data } = await supabase.from<NoteTableRow>(SupabaseNotesProvider.NOTES_TABLE_NAME).insert({
                user_id: user.id,
                title: '',
                content: '',
            }).single()

            return data.id
        })

    findById = (id: string, token: JwtToken): Promise<Note | null> =>
        this.withClientForToken(token, async (supabase) => {
            const { data } = await supabase.from<NoteTableRow>(SupabaseNotesProvider.NOTES_TABLE_NAME)
                .select()
                .eq('id', id)
                .maybeSingle()

            return data ? toNote(data) : null
        })

    getAll = (token: JwtToken): Promise<(Note & WithTags)[]> =>
        this.withClientForToken(token, async (supabase) => {
            const { data } = await supabase.from<NoteTableRow & TagsJoinResult>(SupabaseNotesProvider.NOTES_TABLE_NAME)
                .select('*, note_tags(tags(*))')

            return data.map(toNoteWithTags)
        })
    
    replaceContent = (id: string, token: string, content: EditableContent): Promise<void> =>
        this.withClientForToken(token, async (supabase) => {
            const { status, statusText } = await supabase.from<NoteTableRow>(SupabaseNotesProvider.NOTES_TABLE_NAME)
                .update({
                    title: content.title,
                    content: content.content
                }).eq('id', id)

            if (400 <= status && status < 500) {
                throw new MissingNoteError(id)
            } else if (status >= 500) {
                throw new Error(`Updating note failed: ${statusText}`)
            }
        })
}
