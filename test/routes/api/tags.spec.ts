import { suite } from 'uvu'
import * as assert from '../../assert'
import { withTestServer } from '../../server'

import { makeSugaryFetch } from '../../sugary-fetch'
import { PeopleApi } from '../../../src/lib/people/api'
import { TagsApi } from '../../../src/lib/tags/api'
import { PersonInMemory, peopleInMemory } from '../../../src/lib/people/in-memory/people'
import { tagsInMemory } from '../../../src/lib/tags/in-memory/tags'

type Context = {
    fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>,
    api: TagsApi,
    signInAs: (person: PersonInMemory) => Promise<void>,
}

const test = withTestServer(suite<Context>('Tags Api'))

test.before.each(async (context) => {
    context.fetch = makeSugaryFetch().bind({})
    context.api = new TagsApi(context.fetch, { baseUrl: context.server.url })

    const people = new PeopleApi(context.fetch, { baseUrl: context.server.url })
    context.signInAs = (person) => people.signIn(person.email, person.password).then(() => {})
})

const id = (it: { id: string }) => it.id

test('getting all tags', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)
    const auroraTags = Object.values(tagsInMemory).filter(it => it.author === peopleInMemory.aurora.id)

    let result = await api.getAll()
    assert.sameSet(result.map(id), auroraTags.map(id))

    await signInAs(peopleInMemory.eventide)
    const eventideTags = Object.values(tagsInMemory).filter(it => it.author === peopleInMemory.eventide.id)

    result = await api.getAll()
    assert.sameSet(result.map(id), eventideTags.map(id))
})

test.run()
