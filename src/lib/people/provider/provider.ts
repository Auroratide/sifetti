import type { JwtToken } from '$lib/security/jwt'
import type { Access, Person } from '$lib/shared/people/types'
import type { ProfileName } from '$lib/shared/people/types/profile-name'

export type Credentials = {
    email: string,
    password: string,
}

export type ProfileInfo = {
    name: ProfileName,
}

export class DuplicatePersonError extends Error {
    constructor(email: string) {
        super(`A person with email '${email}' already exists`)
    }
}

export interface PeopleProvider {
    createNew: (creds: Credentials, info: ProfileInfo) => Promise<Person>,
    authenticate: (creds: Credentials) => Promise<Access | null>,
    getByToken: (token: JwtToken) => Promise<Person | null>,
    invalidate: (token: JwtToken) => Promise<void>,
    resetPassword: (token: JwtToken, newPassword: string) => Promise<void>,
    rename: (token: JwtToken, newName: ProfileName) => Promise<void>,
}