import type { Errors } from 'io-ts'
import type { Reporter } from 'io-ts/lib/Reporter'
import { left } from 'fp-ts/lib/Either.js'
import { HttpStatus } from '$lib/shared/http-status'

export const error = (status: number, message: string) => new Response(JSON.stringify({
    message,
}), {
    status,
})

export const badRequest = (reporter: Reporter<string[]>) => (e: Errors) =>
    error(HttpStatus.BadRequest, reporter.report(left(e))[0])

export const found = (to: string, params?: { [key: string]: string }) => {
    let paramString = ''
    if (params !== undefined) {
        const asQueryParam = ([key, value]) => `${key}=${encodeURIComponent(value)}`
        paramString = '?' + Object.entries(params)
            .map(asQueryParam)
            .join('&')
    }

    return new Response(null, {
        status: HttpStatus.Found,
        headers: {
            Location: `${to}${paramString}`
        },
    })
}