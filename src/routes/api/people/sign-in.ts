import type { RequestHandler } from '@sveltejs/kit'
import type { ServerRequest } from '@sveltejs/kit/types/hooks'
import { people } from './_provider'

type SignInBody = {
    email: string,
    password: string,
}

const isJson = (req: ServerRequest): req is ServerRequest<Record<string, any>, SignInBody> => {
    return true
}

export const post: RequestHandler = async (req) => {
    if (isJson(req)) {
        const person = await people.authenticate({
            email: req.body.email,
            password: req.body.password,
        })

        return {
            status: 200,
            body: {
                person,
            },
        }
    }
}
