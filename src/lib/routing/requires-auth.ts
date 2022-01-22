import type { Load, LoadInput } from '@sveltejs/kit'
import { HttpStatus } from './http-status'

export const requiresAuth = (fn: Load): Load => {
    return (input: LoadInput) => {
        if (input.session.person) {
            return fn(input)
        } else {
            return {
                status: HttpStatus.Found,
                redirect: `/sign-in?from=${encodeURIComponent(input.url.pathname)}`,
            }
        }
    }
}