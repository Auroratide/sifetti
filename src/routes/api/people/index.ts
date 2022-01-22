import type { RequestHandler, EndpointOutput } from '@sveltejs/kit'
import type { ServerRequest } from '@sveltejs/kit/types/hooks'
import type { Person } from '$lib/people/types'
import type { Locals } from '../../../hooks'
import { handle, withAuth, withJson } from '../_middleware'
import { people } from '$lib/beans'
import { isFormData, isJson } from '$lib/routing/request-type'
import { HttpStatus } from '$lib/routing/http-status'
import { DuplicatePersonError } from '$lib/people/provider/provider'

type SignUpRequest = {
    email: string,
    password: string,
}

type ChangeCredentialsRequest = Partial<{
    password: string,
}>

export const post: RequestHandler = handle()(async (req) => {
    const res = isFormData(req) ? new FormSignInResponseBuilder() : new JsonSignInResponseBuilder()

    try {
        const person = await createPerson(req)

        return res.success(person)
    } catch (err) {
        if (err instanceof DuplicatePersonError) {
            return res.duplicateAccount()
        } else {
            throw err
        }
    }
})

export const patch: RequestHandler<Locals, ChangeCredentialsRequest> = handle(withAuth, withJson)(async ({ locals, body }) => {
    if (body.password) {
        await people.resetPassword(locals.accessToken, body.password)
    }

    return {
        status: HttpStatus.NoContent,
    }
})

const createPerson = async (req: ServerRequest): Promise<Person> => {
    let email = ''
    let password = ''

    if (isFormData(req)) {
        email = req.body.get('email')
        password = req.body.get('password')
    } else if (isJson<SignUpRequest>(req)) {
        email = req.body.email
        password = req.body.password
    } else {
        throw 'bad-request'
    }

    return await people.createNew({ email, password })
}

abstract class SignInResponseBuilder {
    abstract success: (person: Person) => Promise<EndpointOutput>
    abstract duplicateAccount: () => Promise<EndpointOutput>
}

class FormSignInResponseBuilder extends SignInResponseBuilder {
    success = async (person: Person): Promise<EndpointOutput> => ({
        status: HttpStatus.Found,
        headers: {
            Location: '/please-verify',
        },
    })

    duplicateAccount = async (): Promise<EndpointOutput> => ({
        status: HttpStatus.Found,
        headers: {
            Location: '/sign-up?status=duplicate-account',
        }
    })
}

class JsonSignInResponseBuilder extends SignInResponseBuilder {
    success = async (person: Person): Promise<EndpointOutput> => {
        return {
            status: HttpStatus.Created,
        }
    }

    duplicateAccount = async (): Promise<EndpointOutput> => ({
        status: HttpStatus.Conflict,
        body: {
            message: 'duplicate-person',
        }
    })
}