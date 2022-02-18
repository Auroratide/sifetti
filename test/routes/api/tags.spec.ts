import { suite } from 'uvu'
import * as assert from '../../assert'
import { withTestServer } from '../../server'

import { makeSugaryFetch } from '../../sugary-fetch'
import { PeopleApi } from '../../../src/lib/client/people/api'
import { TagsApi } from '../../../src/lib/client/tags/api'
import { PersonInMemory, peopleInMemory } from '../../../src/lib/people/in-memory/people'
import { tagsInMemory } from '../../../src/lib/tags/in-memory/tags'
import { ApiError } from '../../../src/lib/client/api/error'
import { HttpStatus } from '../../../src/lib/routing/http-status'
import { TagName, TagNameReporter } from '../../../src/lib/tags/tag-name'
import { asType } from '../../as-type'

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

test('adding a tag', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)

    const id = await api.create('new')
    let tags = await api.getAll()

    assert.ok(tags.map(it => it.name).includes(asType('new', TagName)), 'The new tag should have been received')

    let newTag = await api.getOne(id)
    assert.equal(newTag?.name, 'new')
})

test('adding an invalid tag', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)

    try {
        await api.create('invalid  tag')
        assert.unreachable()
    } catch (err) {
        if (assert.isType(err, ApiError)) {
            assert.equal(err.info.status, HttpStatus.BadRequest)
            assert.equal(err.message, TagNameReporter.messages.find(it => it.type.name === 'NonConsecutiveSpaces')?.message ?? 'NOT FOUND')
        }
    }
})

test('duplicating a tag', async ({ signInAs, api }) => {
    await signInAs(peopleInMemory.aurora)

    await api.create('duplicate')
    try {
        await api.create('duplicate')
        assert.unreachable()
    } catch (err) {
        if (assert.isType(err, ApiError)) {
            assert.equal(err.info.status, HttpStatus.BadRequest)
        }
    }
})

test.run()
