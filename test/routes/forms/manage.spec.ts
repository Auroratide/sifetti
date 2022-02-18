import type { Person } from '../../../src/lib/people/types'
import { suite } from 'uvu'
import * as assert from '../../assert'
import { HttpStatus } from '../../../src/lib/routing/http-status'
import { makeSugaryFetch, FetchBinder } from '../../sugary-fetch'
import { PeopleApi } from '../../../src/lib/client/people/api'
import { peopleInMemory, PersonInMemory } from '../../../src/lib/people/in-memory/people'
import { withTestServer } from '../../server'
import { postForm } from '../post-form'

type Context = {
    fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>,
    signInAs: (person: PersonInMemory) => Promise<Person>,
    binder: FetchBinder,
    getInfo: () => Promise<Person>,
}

const test = withTestServer(suite<Context>('Manage Profile via Form Data'))

test.before.each(async (context) => {
    context.binder = {}
    context.fetch = makeSugaryFetch(context.binder)

    const api = new PeopleApi(context.fetch, { baseUrl: context.server.url })
    context.signInAs = (person: PersonInMemory) => api.signIn(person.email, person.password)
    context.getInfo = () => api.myInfo()
})

test('changing profile name', async ({ server, signInAs, getInfo, fetch }) => {
    await signInAs(peopleInMemory.aurora)

    let response = await postForm(fetch)(`${server.url}/forms/me/manage`, {
        name: 'SatelliteGirl',
    })

    assert.equal(response.status, HttpStatus.Found)
    assert.equal(response.headers.get('Location'), '/me/manage')

    const after = await getInfo()
    assert.equal(after.name, 'SatelliteGirl')
})

test('changing to invalid profile name', async ({ server, signInAs, getInfo, fetch }) => {
    await signInAs(peopleInMemory.aurora)

    let response = await postForm(fetch)(`${server.url}/forms/me/manage`, {
        name: 'Satellite  Girl', // consecutive spaces
    })

    assert.equal(response.status, HttpStatus.Found)
    assert.ok(response.headers.get('Location').includes('problem'))

    const after = await getInfo()
    assert.not.equal(after.name, 'Satellite  Girl')
})

test('changing to taken profile name', async ({ server, signInAs, getInfo, fetch }) => {
    await signInAs(peopleInMemory.aurora)

    let response = await postForm(fetch)(`${server.url}/forms/me/manage`, {
        name: peopleInMemory.eventide.name,
    })

    assert.equal(response.status, HttpStatus.Found)
    assert.ok(response.headers.get('Location').includes('problem'))

    const after = await getInfo()
    assert.not.equal(after.name, peopleInMemory.eventide.name)
})

test.run()