import type { RequestHandler } from '@sveltejs/kit'
import { handle, withAuth, withJson } from '../_middleware'
import { people } from '$lib/server/beans'
import { ProfileName, ProfileNameReporter } from '$lib/shared/people/types/profile-name'
import { isLeft } from 'fp-ts/lib/Either.js'
import { error, badRequest } from '$lib/server/routing/respond'
import { HttpStatus } from '$lib/shared/http-status'
import type { JwtToken } from '$lib/security/jwt'
import { NameTakenError } from '$lib/shared/people/provider/error'

export const get: RequestHandler = handle(withAuth)(async ({ locals }) => {
    const person = await people.getByToken(locals.accessToken)

    return new Response(JSON.stringify(person))
})

type EditMyInfoRequest = Partial<{
    name: string,
}>

export const patch: RequestHandler = handle(withAuth, withJson)(async ({ request, locals }) => {
    const body = (await request.json()) as EditMyInfoRequest
    let response: Response = undefined
    if (body.name !== undefined) {
        response = await changeName(locals.accessToken, body.name)
    }

    return response ?? new Response(null, {
        status: HttpStatus.NoContent,
    })
})

const changeName = async (token: JwtToken, name: string) => {
    const nameValidation = ProfileName.decode(name)
    if (isLeft(nameValidation)) {
        return badRequest(ProfileNameReporter)(nameValidation.left)
    } else {
        try {
            await people.rename(token, nameValidation.right)
        } catch (err) {
            if (err instanceof NameTakenError) {
                return error(HttpStatus.Conflict, err.message)
            }

            throw err
        }
    }
}
