import type { ProfileName } from '../../shared/people/types/profile-name'
import type { DemoNote } from './notes/_types'
import type { Person } from '../../shared/people/types'
import type { Note } from '../../shared/notes/types'
import type { Tag, TagId } from '../../shared/tags/types'
import * as notes from './notes'

export const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoiMSIsImVtYWlsIjoiZGVtb0BzaWZldHRpLmNvbSJ9.nPynXfd13LN8-qUgiopwVc0wPpN70ZAzAaN1cHCf6Ns'

export const demoPerson = {
    id: '1',
    email: 'demo@sifetti.com',
    password: 'demo',
    name: 'Demo' as ProfileName,
}

const createTagsFromNotes = (notes: Record<string, DemoNote>, forPerson: Pick<Person, 'id'>): Record<string, Tag> => {
    // remove duplicates
    const setOfTags = Object.values(notes)
        .reduce((set, note) => new Set([...set, ...note.tags]), new Set<string>())

    return Array.from(setOfTags).reduce((result, tag, index) => ({
        ...result,
        [tag]: {
            id: (index + 1).toString(),
            author: forPerson.id,
            name: tag,
        },
    }), {})
}

const createNotes = (notes: Record<string, DemoNote>, tags: Record<string, Tag>, forPerson: Pick<Person, 'id'>): Record<string, Note & { tags: Set<TagId> }> => {
    const findTagId = (name: string) => tags[name].id
    
    return Object.entries(notes).reduce((result, [ name, note ], index) => ({
        ...result,
        [name]: {
            id: (index + 1).toString(),
            author: forPerson.id,
            title: note.title,
            content: note.content,
            tags: new Set(note.tags.map(findTagId)),
        }
    }), {})
}

const tagsMap = createTagsFromNotes(notes, demoPerson)
const notesMap = createNotes(notes, tagsMap, demoPerson)

export const demoTags = Object.values(tagsMap)
export const demoNotes = Object.values(notesMap)
export const demoNoteTags = demoNotes.reduce((result, { id, tags }) => ({
    ...result,
    [id]: tags,
}), {})
