import type { ReadOnlyFormData } from '@sveltejs/kit/types/helper'
import type { ServerRequest } from '@sveltejs/kit/types/hooks'

export const isFormData = (req: ServerRequest): req is ServerRequest<Record<string, any>, ReadOnlyFormData> => {
    return req.headers['content-type'] === 'application/x-www-form-urlencoded'
}

export const isJson = <T>(req: ServerRequest): req is ServerRequest<Record<string, any>, T> => {
    return req.headers['content-type'] === 'application/json'
}
