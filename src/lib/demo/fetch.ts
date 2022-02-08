import type { NotesProvider } from '../notes/provider/provider'
import * as notesEndpoints from '../notes/endpoints/index'
import type { RequestEvent } from '@sveltejs/kit'
import { demoToken } from './data'

const makeRequestEvent = (match: RegExpMatchArray, input: RequestInfo, init?: RequestInit): RequestEvent => ({
    request: new Request(input, init),
    url: null,
    params: {},
    locals: {
        accessToken: demoToken,
    },
    platform: {},
})

export const createDemoFetch = (providers: { notes: NotesProvider }) => {
    const endpoints: Record<string, Record<string, (req: RequestEvent) => Promise<Response>>> = {
        '^/api/notes$': {
            GET: async (req: RequestEvent) => (await notesEndpoints.get(providers.notes)(req)) as Response,
            POST: async (req: RequestEvent) => (await notesEndpoints.post(providers.notes)(req)) as Response,
        },
    }

    return async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
        const url = typeof input === 'string' ? input : input.url

        const entries = Object.entries(endpoints)
        for (let [ matcher, actions ] of entries) {
            const match = url.match(new RegExp(matcher))
            if (match) {
                return actions[init?.method ?? 'GET'](makeRequestEvent(match, input, init))
            }
        }

        throw new Error(`Could not match "${url}" in demo fetch`)
    }
}