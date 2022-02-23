import type { RequestHandler } from '@sveltejs/kit'
import { people } from '$lib/server/beans'
import { HttpStatus } from '$lib/shared/http-status'
import * as cookie from '$lib/server/routing/cookie'
import { isFormData, isJson } from '$lib/server/routing/request-type'
import type { RequestEvent } from '@sveltejs/kit/types/hooks'
import type { Access } from '$lib/shared/people/types'
import { handle } from '../_middleware'
import { PeopleApiErrorType } from '$lib/client/people/api'

type SignInRequest = {
    email: string,
    password: string,
}

export const post: RequestHandler = handle()(async (req) => {
    const access = await authenticate(req)

    const res = isFormData(req) ? new FormSignInResponseBuilder(access.destination) : new JsonSignInResponseBuilder()

    if (access.access) {
        return res.success(access.access)
    } else {
        return res.failure(PeopleApiErrorType.BadCredentials)
    }
})

export const del: RequestHandler = handle()(async ({ locals }) => {
    if (locals.accessToken)
        await people.invalidate(locals.accessToken)
    
    return {
        status: HttpStatus.NoContent,
        headers: {
            'Set-Cookie': [cookie.serialize('access_token', 'x', {
                expires: new Date(0),
            })]
        }
    }
})

const authenticate = async (req: RequestEvent): Promise<{ access: Access, destination?: string } | null> => {
    let email = ''
    let password = ''
    let destination: string = undefined

    if (isFormData(req)) {
        const body = await req.request.formData()
        email = body.get('email') as string
        password = body.get('password') as string
        destination = body.get('destination') as string
    } else if (isJson(req)) {
        const body = (await req.request.json()) as SignInRequest
        email = body.email
        password = body.password
    } else {
        throw 'bad-request'
    }

    return {
        access: await people.authenticate({ email, password }),
        destination,
    }
}

abstract class SignInResponseBuilder {
    abstract success: (access: Access) => Promise<Response>
    abstract failure: (type: PeopleApiErrorType) => Promise<Response>

    protected cookies = (access: Access): string[] =>
        [cookie.serialize('access_token', access.token, {
            expires: access.expires,
        })]
}

class FormSignInResponseBuilder extends SignInResponseBuilder {
    private destination: string

    constructor(destination?: string) {
        super()
        this.destination = destination ? destination : '/me'
    }

    success = async (access: Access): Promise<Response> => {
        const headers = new Headers()
        headers.append('Location', this.destination)
        this.cookies(access).forEach(cookie => headers.append('Set-Cookie', cookie))

        return new Response(null, {
            status: HttpStatus.Found,
            headers,
        })
    }

    failure = async (type: PeopleApiErrorType): Promise<Response> => new Response(null, {
        status: HttpStatus.Found,
        headers: {
            Location: `/sign-in?status=${type}`,
        },
    })
}

class JsonSignInResponseBuilder extends SignInResponseBuilder {
    success = async (access: Access): Promise<Response> => {
        const person = await people.getByToken(access.token)

        const headers = new Headers()
        this.cookies(access).forEach(cookie => headers.append('Set-Cookie', cookie))

        return new Response(JSON.stringify({ person }), {
            status: HttpStatus.Created,
            headers,
        })
    }

    failure = async (type: PeopleApiErrorType): Promise<Response> =>
        new Response(JSON.stringify({ message: type }), {
            status: HttpStatus.Forbidden,
        })
}
