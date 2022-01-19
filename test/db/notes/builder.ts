import type { NoteTableRow } from './types'

export const buildNote = ({
    user_id,
    title = 'title',
    content = 'content',
}: NoteTableRow) => ({
    user_id, title, content,
})