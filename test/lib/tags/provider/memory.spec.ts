import { suite } from 'uvu'
import { MemoryPeopleProvider } from '../../../../src/lib/people/provider/memory'
import { MemoryNotesProvider } from '../../../../src/lib/notes/provider/memory'
import { MemoryTagsProvider } from '../../../../src/lib/tags/provider/memory'

import { TestPeople, TestNotes, withProvider, Context } from './provider.spec'

const memoryPeopleProvider = new MemoryPeopleProvider(Object.values(TestPeople))
const memoryNotesProvider = new MemoryNotesProvider(memoryPeopleProvider, [])
const test = withProvider(
    suite<Context<MemoryTagsProvider>>('Memory Tags Provider'),
    () => new MemoryTagsProvider(memoryPeopleProvider, memoryNotesProvider, [])
)

test.before.each(async (context) => {
    context.tokens = {
        Cay: '',
        Antler: '',
    }

    const testPeople = Object.entries(TestPeople)
    for (let [ name, person ] of testPeople) {
        context.tokens[name] = (await memoryPeopleProvider.authenticate(person)).token
    }

    context.notes = {
        Vercon: '',
    }
    const testNotes = Object.entries(TestNotes)
    for (let [ name, note ] of testNotes) {
        context.notes[name] = await memoryNotesProvider.createEmpty(context.tokens[note.person])
    }
})

test.run()
