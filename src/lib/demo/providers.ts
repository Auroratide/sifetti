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
import type { PeopleProvider } from '../people/provider/provider'
import type { TagsProvider } from '../tags/provider/provider'
import type { NotesProvider } from '../notes/provider/provider'

export type DemoProviders = {
    people: PeopleProvider,
    tags: TagsProvider,
    notes: NotesProvider,
}

export const createDemoProviders = (): DemoProviders => {
    const people = new MemoryPeopleProvider([demoPerson], {
        [demoToken]: demoPerson.id,
    }, () => demoToken)
    const tags = new MemoryTagsProvider(people, demoNotes, demoTags, demoNoteTags)
    const notes = new MemoryNotesProvider(people, tags, demoNotes)

    return {
        people,
        tags,
        notes,
    }
}
