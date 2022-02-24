import type { Note, WithTags } from '$lib/shared/notes/types'

export const buildNote = ({
    id = '1',
    author = '1',
    title = 'title',
    content = 'content',
    tags = [],
    createdAt = new Date(),
    updatedAt = new Date(),
}): Note & WithTags => ({
    id,
    author,
    title,
    content,
    tags,
    createdAt,
    updatedAt,
})
