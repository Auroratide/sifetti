import type { JwtToken } from '$lib/security/jwt'
import type { Access, Person } from '../types'

export type Credentials = {
    email: string,
    password: string,
}

export class DuplicatePersonError extends Error {
    constructor(email: string) {
        super(`A person with email '${email}' already exists`)
    }
}

export interface PeopleProvider {
    createNew: (creds: Credentials) => Promise<Person>,
    authenticate: (creds: Credentials) => Promise<Access | null>,
    getByToken: (token: JwtToken) => Promise<Person | null>,
    invalidate: (token: JwtToken) => Promise<void>,
    resetPassword: (token: JwtToken, newPassword: string) => Promise<void>,
}