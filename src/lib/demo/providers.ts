import { MemoryPeopleProvider } from '../people/provider/memory'
import { MemoryNotesProvider } from '../notes/provider/memory'
import { MemoryTagsProvider } from '../tags/provider/memory'
import {
    demoPerson,
    demoNotes,
    demoTags,
    demoNoteTags,
    demoToken,
} from './data'

export const createDemoProviders = async () => {
    const people = new MemoryPeopleProvider([demoPerson], () => demoToken)
    const tags = new MemoryTagsProvider(people, demoNotes, demoTags, demoNoteTags)
    const notes = new MemoryNotesProvider(people, tags, demoNotes)

    await people.authenticate(demoPerson)

    return {
        people,
        tags,
        notes,
    }
}
