import type { WithTags } from './types'
import type { Tag } from '$lib/shared/tags/types'

const tagInNote = (note: WithTags) => (tag: Tag) => note.tags.map(it => it.id).includes(tag.id)
export const containingAllTags = (tags: Tag[]) => (note: WithTags) =>
    tags.length === 0 || tags.every(tagInNote(note))
