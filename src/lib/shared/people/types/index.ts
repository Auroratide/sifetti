import type { JwtToken } from '$lib/security/jwt'
import type { ProfileName } from './profile-name'

export type Id = string

export type Access = {
    token: JwtToken,
    expires: Date,
}

/**
 * Represents info about a person.
 * 
 * NEVER put sensitive info in this model, as it is exposed to client JS.
 */
export type Person = {
    id: Id,
    email: string,
    name?: ProfileName,
}
