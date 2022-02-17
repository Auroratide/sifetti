import type { Errors } from 'io-ts'
import type { Reporter } from 'io-ts/lib/Reporter'
import { left } from 'fp-ts/lib/Either.js'
import { HttpStatus } from './http-status'

export const error = (status: number, message: string) => new Response(JSON.stringify({
    message,
}), {
    status,
})

export const badRequest = (reporter: Reporter<string[]>) => (e: Errors) =>
    error(HttpStatus.BadRequest, reporter.report(left(e))[0])