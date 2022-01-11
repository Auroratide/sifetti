import { peopleInMemory } from '../../people/in-memory/people'
import { notesInMemory } from '../../notes/in-memory/notes'

export const tagsInMemory = {
    natural: {
        id: '1',
        author: peopleInMemory.aurora.id,
        name: 'natural',
    },
    visited: {
        id: '2',
        author: peopleInMemory.aurora.id,
        name: 'visited',
    },
}

export const noteTagsInMemory = {
    [notesInMemory.borealis.id]: new Set([tagsInMemory.natural.id, tagsInMemory.visited.id]),
    [notesInMemory.australis.id]: new Set([tagsInMemory.natural.id]),
}
