import type { Load } from '@sveltejs/kit'
import { HttpStatus } from '$lib/shared/http-status'

export const requiresAuth = (fn: Load): Load => {
    return (input) => {
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