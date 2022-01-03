import type { RequestHandler } from '@sveltejs/kit'
import type { ReadOnlyFormData } from '@sveltejs/kit/types/helper'
import type { ServerRequest } from '@sveltejs/kit/types/hooks'
import { people } from './_provider'
import { HttpStatus } from '$lib/routing/http-status'

const isFormData = (req: ServerRequest): req is ServerRequest<Record<string, any>, ReadOnlyFormData> => {
    return true
}

const redirection = (Location: string) => ({
    status: HttpStatus.Found,
    headers: { Location },
})

export const post: RequestHandler = async (req) => {
    if (isFormData(req)) {
        const email = req.body.get('email')
        const password = req.body.get('password')

        const person = await people.authenticate({ email, password })

        if (person) {
            return redirection('/me')
        } else {
            return redirection('/sign-in?status=bad-credentials')
        }
    }

    return redirection('/sign-in?status=bad-request')
}
