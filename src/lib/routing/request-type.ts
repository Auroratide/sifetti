import type { RequestEvent } from '@sveltejs/kit/types/hooks'

export const isFormData = (event: RequestEvent): boolean => {
    return event.request.headers.get('content-type') === 'application/x-www-form-urlencoded'
}

export const isJson = (event: RequestEvent): boolean => {
    return event.request.headers.get('content-type') === 'application/json'
}
