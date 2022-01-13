import { suite } from 'uvu'
import { MemoryPeopleProvider } from '../../../../src/lib/people/provider/memory'
import { MemoryNotesProvider } from '../../../../src/lib/notes/provider/memory'
import { MemoryTagsProvider } from '../../../../src/lib/tags/provider/memory'

import { TestPeople, withProvider, Context } from './provider.spec'

const memoryPeopleProvider = new MemoryPeopleProvider(Object.values(TestPeople))
const test = withProvider(
    suite<Context<MemoryNotesProvider>>('Memory Notes Provider'),
    () => {
        const noteDb = []
        return new MemoryNotesProvider(memoryPeopleProvider, new MemoryTagsProvider(memoryPeopleProvider, noteDb), noteDb)
    }
)

test.before.each(async (context) => {
    context.tokens = {
        Cay: '',
        Antler: '',
    }
    const entries = Object.entries(TestPeople)

    for (let [ name, person ] of entries) {
        context.tokens[name] = (await memoryPeopleProvider.authenticate(person)).token
    }
})

test.run()
