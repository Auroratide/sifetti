import { MemoryPeopleProvider } from '../../shared/people/provider/memory'
import { MemoryNotesProvider } from '../../shared/notes/provider/memory'
import { MemoryTagsProvider } from '../../shared/tags/types/provider/memory'
import {
    demoPerson,
    demoNotes,
    demoTags,
    demoNoteTags,
    demoToken,
} from './data'
import type { PeopleProvider } from '../../shared/people/provider/provider'
import type { TagsProvider } from '../../shared/tags/types/provider/provider'
import type { NotesProvider } from '../../shared/notes/provider/provider'

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
