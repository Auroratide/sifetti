import { suite } from 'uvu'
import { MemoryPeopleProvider } from '../../../../src/lib/shared/people/provider/memory'
import { MemoryNotesProvider } from '../../../../src/lib/shared/notes/provider/memory'
import { MemoryTagsProvider } from '../../../../src/lib/shared/tags/types/provider/memory'
import { sign } from '../../../../src/lib/server/jwt'

import { TestPeople, TestNotes, withProvider, Context } from './provider.spec'

const noteDb = []
const memoryPeopleProvider = new MemoryPeopleProvider(Object.values(TestPeople), {}, sign)
const test = withProvider(
    suite<Context<MemoryTagsProvider>>('Memory Tags Provider'),
    () => new MemoryTagsProvider(memoryPeopleProvider, noteDb, [])
)

test.before.each(async (context) => {
    const memoryNotesProvider = new MemoryNotesProvider(memoryPeopleProvider, context.provider, noteDb)
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
