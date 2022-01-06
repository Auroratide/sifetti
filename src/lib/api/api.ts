import { ApiError } from './error'

export type ApiConfig = {
    baseUrl?: string,
}

export class Api {
    private fetch: (input: RequestInfo, init?: RequestInit) =>Promise<Response>
    private baseUrl: string

    constructor(fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>, {
        baseUrl = '',
    }: ApiConfig = {}) {
        this.fetch = fetch
        this.baseUrl = baseUrl
    }

    protected post = (url: string, body?: object): Promise<Response> =>
        this.withErrorHandler('POST', url, () => this.fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': body ? 'application/json' : undefined,
            },
            body: body ? JSON.stringify(body) : undefined,
        }))

    protected withErrorHandler = async (method: string, endpoint: string, fn: () => Promise<Response>): Promise<Response> => {
        try {
            const res = await fn()
            if (res.ok) {
                return res
            } else {
                const body = await res.json()
                throw new ApiError(body.message, {
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
                throw new ApiError(err.message, {
                    method,
                    endpoint,
                })
            }
        }
    }
}