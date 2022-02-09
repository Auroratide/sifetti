import { ApiError } from './error'

export type ApiConfig = {
    /**
     * Useful for testing where the port can change from test to test
     */
    baseUrl?: string,
}

/**
 * Utility for API wrappers that constructs common request elements automatically
 * and handles errors consistently
 */
export class Api {
    private fetch: (input: RequestInfo, init?: RequestInit) =>Promise<Response>
    private baseUrl: string

    constructor(fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>, {
        baseUrl = '',
    }: ApiConfig = {}) {
        this.fetch = fetch
        this.baseUrl = baseUrl
    }

    protected get = (url: string): Promise<Response> =>
        this.withErrorHandler('GET', url, () => this.fetch(`${this.baseUrl}${url}`))

    protected post = (url: string, body?: object): Promise<Response> =>
        this.withErrorHandler('POST', url, () => this.fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': body ? 'application/json' : undefined,
            },
            body: body ? JSON.stringify(body) : undefined,
        }))

    protected patch = (url: string, body?: object): Promise<Response> =>
        this.withErrorHandler('PATCH', url, () => this.fetch(`${this.baseUrl}${url}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': body ? 'application/json' : undefined,
            },
            body: body ? JSON.stringify(body) : undefined,
        }))

    protected del = (url: string): Promise<Response> =>
        this.withErrorHandler('DELETE', url, () => this.fetch(`${this.baseUrl}${url}`, {
            method: 'DELETE',
        }))

    protected withErrorHandler = async (method: string, endpoint: string, fn: () => Promise<Response>): Promise<Response> => {
        try {
            const res = await fn()
            if (res.ok) {
                return res
            } else {
                const body = await res.json()
                throw new ApiError(body?.message ?? `Non-ok status ${res.status} received on endpoint`, {
                    status: res.status,
                    data: body,
                    method,
                    endpoint,
                })
            }
        } catch(err) {
            if (err instanceof ApiError) {
                throw err
            } else {
                throw new ApiError(err.message ?? 'The api request failed, but I don\'t know why', {
                    method,
                    endpoint,
                })
            }
        }
    }
}