import type { Note, WithTags } from '$lib/shared/notes/types'

export const buildNote = ({
    id = '1',
    author = '1',
    title = 'title',
    content = 'content',
    tags = [],
    createdAt = new Date(Date.parse('2022-01-01T00:00:00.000Z')),
    updatedAt = new Date(Date.parse('2022-01-01T00:00:00.000Z')),
}): Note & WithTags => ({
    id,
    author,
    title,
    content,
    tags,
    createdAt,
    updatedAt,
})
