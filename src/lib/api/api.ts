import { ApiError } from './error'

export class Api {
    private fetch: (input: RequestInfo, init?: RequestInit) =>Promise<Response>

    constructor(fetch: (input: RequestInfo, init?: RequestInit) =>Promise<Response>) {
        this.fetch = fetch
    }

    protected post = (url: string, body?: object): Promise<Response> =>
        this.withErrorHandler('POST', url, () => this.fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            throw new ApiError(err.message, {
                method,
                endpoint,
            })
        }
    }
}