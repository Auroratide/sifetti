import type { RequestHandler } from '@sveltejs/kit'
import type { ServerRequest } from '@sveltejs/kit/types/hooks'
import { people } from './_provider'

type SignUpBody = {
    email: string,
    password: string,
}

const isJson = (req: ServerRequest): req is ServerRequest<Record<string, any>, SignUpBody> => {
    return true
}

export const post: RequestHandler = async (req) => {
    if (isJson(req)) {
        const person = await people.createNew({
            email: req.body.email,
            password: req.body.password,
        })

        return {
            status: 201,
            body: {
                person,
            },
        }
    }
}
