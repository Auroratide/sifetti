import type { RequestEvent, RequestHandler } from '@sveltejs/kit'
import type { DemoProviders } from './providers'
import { demoToken } from './data'
import * as notesEndpoints from '../server/endpoints/notes/index'
import * as notesIdEndpoints from '../server/endpoints/notes/[id]/index'
import * as notesIdEditsEndpoints from '../server/endpoints/notes/[id]/edits'
import * as notesIdTagsEndpoints from '../server/endpoints/notes/[id]/tags/index'
import * as notesIdTagsTagEndpoints from '../server/endpoints/notes/[id]/tags/[tag]'
import * as tagsEndpoint from '../server/endpoints/tags/index'
import * as tagsIdEndpoint from '../server/endpoints/tags/[id]'

const makeParams = (paramNames: string[], match: RegExpMatchArray): Record<string, string> =>
    paramNames.reduce((params, name, index) => ({
        ...params,
        [name]: match[index + 1],
    }), {})

const makeRequestEvent = (params: Record<string, string>, input: RequestInfo, init?: RequestInit): RequestEvent => ({
    request: new Request(input, init),
    url: null,
    params,
    locals: {
        accessToken: demoToken,
    },
    platform: {},
})

type Endpoints = Partial<{
    get: (providers: Partial<DemoProviders>) => RequestHandler,
    post: (providers: Partial<DemoProviders>) => RequestHandler,
    patch: (providers: Partial<DemoProviders>) => RequestHandler,
    del: (providers: Partial<DemoProviders>) => RequestHandler,
}>
const methodMap = {
    get: 'GET',
    post: 'POST',
    patch: 'PATCH',
    del: 'DELETE',
}
type ApiMatchRequest = (match: RegExpMatchArray, input: RequestInfo, init?: RequestInit) => Promise<Response>
const convertIntoActions = (providers: DemoProviders, endpoints: Endpoints, paramNames: string[]): Record<string, ApiMatchRequest> =>
    Object.entries(endpoints).reduce((actions, [ method, endpoint ]) => ({
        ...actions,
        [methodMap[method]]: (match: RegExpMatchArray, input: RequestInfo, init?: RequestInit) => {
            return endpoint(providers)(makeRequestEvent(makeParams(paramNames, match), input, init)) as Response
        }
    }), {})

export const createDemoFetch = (providers: DemoProviders) => {
    const endpoints: Record<string, Record<string, ApiMatchRequest>> = {
        '^/api/notes$': convertIntoActions(providers, notesEndpoints, []),
        '^/api/notes/([^\\/]+)$': convertIntoActions(providers, notesIdEndpoints, ['id']),
        '^/api/notes/([^\\/]+)/edits$': convertIntoActions(providers, notesIdEditsEndpoints, ['id']),
        '^/api/notes/([^\\/]+)/tags$': convertIntoActions(providers, notesIdTagsEndpoints, ['id']),
        '^/api/notes/([^\\/]+)/tags/([^\\/]+)$': convertIntoActions(providers, notesIdTagsTagEndpoints, ['id', 'tag']),
        '^/api/tags$': convertIntoActions(providers, tagsEndpoint, []),
        '^/api/tags/([^\\/]+)$': convertIntoActions(providers, tagsIdEndpoint, ['id']),
    }

    return async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
        const url = typeof input === 'string' ? input : input.url

        const entries = Object.entries(endpoints)
        for (let [ matcher, actions ] of entries) {
            const match = url.match(new RegExp(matcher))
            if (match) {
                return actions[init?.method ?? 'GET'](match, input, init)
            }
        }

        throw new Error(`Could not match "${url}" in demo fetch`)
    }
}