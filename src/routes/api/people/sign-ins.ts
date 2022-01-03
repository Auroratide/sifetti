import type { RequestHandler } from '@sveltejs/kit'
import type { ReadOnlyFormData } from '@sveltejs/kit/types/helper'
import type { ServerRequest } from '@sveltejs/kit/types/hooks'
import { people } from './_provider'
import { HttpStatus } from '$lib/routing/http-status'
import * as cookie from '$lib/routing/cookie'

const isFormData = (req: ServerRequest): req is ServerRequest<Record<string, any>, ReadOnlyFormData> => {
    return true
}

const redirection = (Location: string, cookies: string[] = []) => ({
    status: HttpStatus.Found,
    headers: {
        Location,
        'Set-Cookie': cookies
    },
})

export const post: RequestHandler = async (req) => {
    if (isFormData(req)) {
        const email = req.body.get('email')
        const password = req.body.get('password')

        const access = await people.authenticate({ email, password })

        if (access) {
            return redirection('/me', [
                cookie.serialize('access_token', access.token)
            ])
        } else {
            return redirection('/sign-in?status=bad-credentials')
        }
    }

    return redirection('/sign-in?status=bad-request')
}
