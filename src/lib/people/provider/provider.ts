import type { Person } from '../types'

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
    authenticate: (creds: Credentials) => Promise<Person | null>,
}