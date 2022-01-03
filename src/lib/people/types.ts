import type { JwtToken } from '$lib/security/jwt'

export type Id = string

export type Access = {
    token: JwtToken,
}

/**
 * Represents info about a person.
 * 
 * NEVER put sensitive info in this model, as it is exposed to client JS.
 */
export type Person = {
    id: Id,
    email: string,
}
