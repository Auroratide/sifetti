import type { RequestHandler } from '@sveltejs/kit'
import { withAuth, handle } from '../_middleware'
import * as cookie from '$lib/server/routing/cookie'
import { people } from '$lib/server/beans'
import { HttpStatus } from '$lib/shared/http-status'

const EXPIRY_BUFFER = 1000 * 60 * 60 * 12 // half a day
const withinExpiryBuffer = (expires: Date): boolean => (Date.now() + EXPIRY_BUFFER) > (expires?.getTime() ?? Infinity)

// requiring auth for now; if inactive for a long time, login will be required
export const post: RequestHandler = handle(withAuth)(async ({ locals }) => {
    if (withinExpiryBuffer(locals.tokenExpiry)) {
        const newAccess = await people.refreshAccess(locals.refreshToken)
        const headers = new Headers()
        cookie.serializeAccess(newAccess).forEach(cookie => headers.append('Set-Cookie', cookie))
    
        return new Response(null, {
            status: HttpStatus.Created,
            headers,
        })
    } else {
        return new Response(null, {
            status: HttpStatus.NoContent,
        })
    }
})
