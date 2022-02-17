import type { RequestHandler } from '@sveltejs/kit'
import { handle, withAuth, withJson } from '../_middleware'
import { people } from '$lib/beans'
import { ProfileName, ProfileNameReporter } from '$lib/people/profile-name'
import { isLeft } from 'fp-ts/lib/Either.js'
import { badRequest } from '$lib/routing/respond'
import { HttpStatus } from '$lib/routing/http-status'

export const get: RequestHandler = handle(withAuth)(async ({ locals }) => {
    const person = await people.getByToken(locals.accessToken)

    return new Response(JSON.stringify(person))
})

type EditMyInfoRequest = Partial<{
    name: string,
}>

export const patch: RequestHandler = handle(withAuth, withJson)(async ({ request, locals }) => {
    const body = (await request.json()) as EditMyInfoRequest
    if (body.name !== undefined) {
        const nameValidation = ProfileName.decode(body.name)
        if (isLeft(nameValidation)) {
            return badRequest(ProfileNameReporter)(nameValidation.left)
        } else {
            await people.rename(locals.accessToken, nameValidation.right)
        }
    }

    return new Response(null, {
        status: HttpStatus.NoContent,
    })
})
