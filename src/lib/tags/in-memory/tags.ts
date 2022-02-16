import { peopleInMemory } from '../../people/in-memory/people'
import { notesInMemory } from '../../notes/in-memory/notes'
import type { TagName } from '../tag-name'

export const tagsInMemory = {
    natural: {
        id: '1',
        author: peopleInMemory.aurora.id,
        name: 'natural' as TagName,
    },
    visited: {
        id: '2',
        author: peopleInMemory.aurora.id,
        name: 'visited' as TagName,
    },
}

export const noteTagsInMemory = {
    [notesInMemory.borealis.id]: new Set([tagsInMemory.natural.id, tagsInMemory.visited.id]),
    [notesInMemory.australis.id]: new Set([tagsInMemory.natural.id]),
}
