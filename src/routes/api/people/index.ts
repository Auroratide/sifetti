import type { RequestHandler, EndpointOutput } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit/types/hooks'
import type { Person } from '$lib/people/types'
import { handle, withAuth, withJson } from '../_middleware'
import { people } from '$lib/beans'
import { PeopleApiErrorType } from '$lib/people/api'
import { isFormData, isJson } from '$lib/routing/request-type'
import { HttpStatus } from '$lib/routing/http-status'
import { DuplicatePersonError } from '$lib/people/provider/provider'
import { error } from '$lib/routing/error'
import { isRight } from 'fp-ts/Either'
import { ProfileName } from '$lib/people/profile-name'

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
    const res = isFormData(req) ? new FormSignInResponseBuilder() : new JsonSignInResponseBuilder()

    try {
        const person = await createPerson(req)

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

const createPerson = async (req: RequestEvent): Promise<Person> => {
    let name = ''
    let email = ''
    let password = ''

    if (isFormData(req)) {
        const body = await req.request.formData()
        name = body.get('username') as string
        email = body.get('email') as string
        password = body.get('password') as string

        let confirmPassword = body.get('confirm-password')

        if (password !== confirmPassword) {
            throw new CreatePersonRequestError(PeopleApiErrorType.MismatchedPasswords)
        }
    } else if (isJson(req)) {
        const body = (await req.request.json()) as SignUpRequest
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
    abstract success: (person: Person) => Promise<EndpointOutput>
    abstract failure: (type: PeopleApiErrorType) => Promise<EndpointOutput>
}

class FormSignInResponseBuilder extends SignInResponseBuilder {
    success = async (person: Person): Promise<EndpointOutput> => ({
        status: HttpStatus.Found,
        headers: {
            Location: '/please-verify',
        },
    })

    failure = async (type: PeopleApiErrorType): Promise<EndpointOutput> => ({
        status: HttpStatus.Found,
        headers: {
            Location: `/sign-up?status=${type}`,
        }
    })
}

class JsonSignInResponseBuilder extends SignInResponseBuilder {
    success = async (person: Person): Promise<EndpointOutput> => {
        return {
            status: HttpStatus.Created,
        }
    }

    failure = async (type: PeopleApiErrorType): Promise<EndpointOutput> => {
        let status = HttpStatus.BadRequest
        if (type === PeopleApiErrorType.DuplicatePerson)
            status = HttpStatus.Conflict

        return error(status, type)
    }
}