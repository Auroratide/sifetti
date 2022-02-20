import type { Note, WithTags } from '$lib/shared/notes/types'

export const buildNote = ({
    id = '1',
    author = '1',
    title = 'title',
    content = 'content',
    tags = [],
}): Note & WithTags => ({ id, author, title, content, tags })
