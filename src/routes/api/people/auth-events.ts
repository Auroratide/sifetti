import type { RequestHandler } from '@sveltejs/kit'
import type { JwtToken } from '$lib/shared/jwt'
import { handle, withJson } from '../_middleware'
import { HttpStatus } from '$lib/shared/http-status'
import { error } from '$lib/server/routing/respond'
import * as cookie from '$lib/server/routing/cookie'

enum AuthEventType {
    Invite = 'invite',
}

type AuthEventsRequestBody = {
    accessToken: JwtToken,
    expiresIn: number,
    refreshToken: string,
    type: AuthEventType,
}

const eventDestination = (type: AuthEventType): string => {
    switch(type) {
        case AuthEventType.Invite: return '/reset-password'
        default: throw new Error('Not a valid auth event type')
    }
}

export const post: RequestHandler = handle(withJson)(async ({ request }) => {
    const body = (await request.json()) as AuthEventsRequestBody
    try {
        const location = eventDestination(body.type)

        return {
            status: HttpStatus.Created,
            headers: {
                'Set-Cookie': [cookie.serialize('access_token', body.accessToken)],
                'Location': location,
            },
        }
    } catch (err) {
        return error(HttpStatus.BadRequest, err.message)
    }
})
