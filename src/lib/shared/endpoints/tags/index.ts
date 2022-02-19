import type { RequestHandler } from '@sveltejs/kit'
import { HttpStatus } from '$lib/shared/http-status'
import { DuplicateTagError } from '$lib/shared/tags/types/provider/error'
import { error, badRequest } from '$lib/server/routing/respond'
import type { TagsProvider } from '$lib/shared/tags/types/provider/provider'
import { TagName, TagNameReporter } from '$lib/shared/tags/types/tag-name'
import { isLeft } from 'fp-ts/lib/Either.js'

export const get = ({ tags }: { tags: TagsProvider }): RequestHandler => async ({ locals }) => {
    const items = await tags.getAll(locals.accessToken)

    return new Response(JSON.stringify({ items }))
}

type CreateTagRequest = {
    name: string,
}

export const post = ({ tags }: { tags: TagsProvider }): RequestHandler => async ({ locals, request }) => {
    const body = (await request.json()) as CreateTagRequest
    const tagNameValidation = TagName.decode(body.name)

    if (isLeft(tagNameValidation)) {
        return badRequest(TagNameReporter)(tagNameValidation.left)
    } else {
        const tagName = tagNameValidation.right
        try {
            const id = await tags.create(locals.accessToken, tagName)
            return new Response(null, {
                status: HttpStatus.Created,
                headers: {
                    Location: `/api/tags/${id}`,
                },
            })
        } catch (err) {
            if (err instanceof DuplicateTagError) {
                return error(HttpStatus.BadRequest, err.message)
            }

            throw err
        }
    }
}
