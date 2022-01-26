import type { EndpointOutput, RequestHandler } from '@sveltejs/kit'
import { people } from '$lib/beans'
import { HttpStatus } from '$lib/routing/http-status'
import * as cookie from '$lib/routing/cookie'
import { isFormData, isJson } from '$lib/routing/request-type'
import type { ServerRequest } from '@sveltejs/kit/types/hooks'
import type { Access } from '$lib/people/types'
import { handle } from '../_middleware'

type SignInRequest = {
    email: string,
    password: string,
}

export const post: RequestHandler = handle()(async (req) => {
    const access = await authenticate(req)

    const res = isFormData(req) ? new FormSignInResponseBuilder(req.body.get('destination')) : new JsonSignInResponseBuilder()

    if (access) {
        return res.success(access)
    } else {
        return res.failure()
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

const authenticate = async (req: ServerRequest): Promise<Access | null> => {
    let email = ''
    let password = ''

    if (isFormData(req)) {
        email = req.body.get('email')
        password = req.body.get('password')
    } else if (isJson<SignInRequest>(req)) {
        email = req.body.email
        password = req.body.password
    } else {
        throw 'bad-request'
    }

    return await people.authenticate({ email, password })
}

abstract class SignInResponseBuilder {
    abstract success: (access: Access) => Promise<EndpointOutput>
    abstract failure: () => Promise<EndpointOutput>

    protected cookies = (access: Access): string[] =>
        [cookie.serialize('access_token', access.token, {
            expires: access.expires,
        })]
}

class FormSignInResponseBuilder extends SignInResponseBuilder {
    private destination: string

    constructor(destination: string) {
        super()
        this.destination = destination ? destination : '/me'
    }

    success = async (access: Access): Promise<EndpointOutput> => ({
        status: HttpStatus.Found,
        headers: {
            Location: this.destination,
            'Set-Cookie': this.cookies(access),
        },
    })

    failure = async (): Promise<EndpointOutput> => ({
        status: HttpStatus.Found,
        headers: {
            Location: '/sign-in?status=bad-credentials',
        }
    })
}

class JsonSignInResponseBuilder extends SignInResponseBuilder {
    success = async (access: Access): Promise<EndpointOutput> => {
        const person = await people.getByToken(access.token)

        return {
            status: HttpStatus.Created,
            headers: {
                'Set-Cookie': this.cookies(access),
            },
            body: { person },
        }
    }

    failure = async (): Promise<EndpointOutput> => ({
        status: HttpStatus.Forbidden,
        body: {
            message: 'bad-credentials',
        }
    })
}
