import type { RequestHandler, RequestHandlerOutput } from '@sveltejs/kit'
import type { Person } from '$lib/shared/people/types'
import { handle, withAuth, withJson } from '../_middleware'
import { people } from '$lib/server/beans'
import { PeopleApiErrorType } from '$lib/client/people/api'
import { isFormData, isJson } from '$lib/server/routing/request-type'
import { HttpStatus } from '$lib/shared/http-status'
import { DuplicatePersonError } from "$lib/shared/people/provider/error"
import { error } from '$lib/server/routing/respond'
import { isRight } from 'fp-ts/lib/Either.js'
import { ProfileName } from '$lib/shared/people/types/profile-name'

type SignUpRequest = {
    name: string,
    email: string,
    password: string,
}

type ChangeCredentialsRequest = Partial<{
    password: string,
}>

class CreatePersonRequestError extends Error {
    readonly type: PeopleApiErrorType
    constructor(type: PeopleApiErrorType) {
        super(type)
        this.type = type
    }
}

export const post: RequestHandler = handle()(async (req) => {
    const res = isFormData(req.request) ? new FormSignInResponseBuilder() : new JsonSignInResponseBuilder()

    try {
        const person = await createPerson(req.request)

        return res.success(person)
    } catch (err) {
        if (err instanceof DuplicatePersonError) {
            return res.failure(PeopleApiErrorType.DuplicatePerson)
        } else if (err instanceof CreatePersonRequestError) {
            return res.failure(err.type)
        } else {
            throw err
        }
    }
})

export const patch: RequestHandler = handle(withAuth, withJson)(async ({ locals, request }) => {
    const body = (await request.json()) as ChangeCredentialsRequest
    if (body.password) {
        await people.resetPassword(locals.accessToken, body.password)
    }

    return {
        status: HttpStatus.NoContent,
    }
})

const createPerson = async (req: Request): Promise<Person> => {
    let name = ''
    let email = ''
    let password = ''

    if (isFormData(req)) {
        const body = await req.formData()
        name = body.get('username') as string
        email = body.get('email') as string
        password = body.get('password') as string

        let confirmPassword = body.get('confirm-password')

        if (password !== confirmPassword) {
            throw new CreatePersonRequestError(PeopleApiErrorType.MismatchedPasswords)
        }
    } else if (isJson(req)) {
        const body = (await req.json()) as SignUpRequest
        name = body.name
        email = body.email
        password = body.password
    } else {
        throw 'bad-request'
    }

    const nameValidation = ProfileName.decode(name)
    if (isRight(nameValidation)) {
        return await people.createNew({ email, password }, { name: nameValidation.right })
    } else {
        throw new CreatePersonRequestError(PeopleApiErrorType.InvalidProfileName)
    }
}

abstract class SignInResponseBuilder {
    abstract success: (person: Person) => Promise<RequestHandlerOutput>
    abstract failure: (type: PeopleApiErrorType) => Promise<RequestHandlerOutput>
}

class FormSignInResponseBuilder extends SignInResponseBuilder {
    success = async (_: Person): Promise<RequestHandlerOutput> => ({
        status: HttpStatus.Found,
        headers: {
            Location: '/please-verify',
        },
    })

    failure = async (type: PeopleApiErrorType): Promise<RequestHandlerOutput> => ({
        status: HttpStatus.Found,
        headers: {
            Location: `/sign-up?status=${type}`,
        }
    })
}

class JsonSignInResponseBuilder extends SignInResponseBuilder {
    success = async (_: Person): Promise<RequestHandlerOutput> => {
        return {
            status: HttpStatus.Created,
        }
    }

    failure = async (type: PeopleApiErrorType): Promise<RequestHandlerOutput> => {
        let status = HttpStatus.BadRequest
        if (type === PeopleApiErrorType.DuplicatePerson)
            status = HttpStatus.Conflict

        return error(status, type)
    }
}