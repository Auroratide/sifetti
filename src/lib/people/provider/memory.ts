import type { Credentials, PeopleProvider } from './provider'
import { DuplicatePersonError } from './provider'
import type { Person } from '../types'
import * as jwt from 'jsonwebtoken'

export type StoredPerson = {
    id: string,
    email: string,
    password: string,
}

// This 'secret' doesn't matter at the moment since it's used in development only
const SECRET = 'secret'

/**
 * For use in a local environment only because it
 * STORES PASSWORDS IN PLAINTEXT. NEVER DO THAT in prod.
 * Also it's ephemeral.
 */
export class MemoryPeopleProvider implements PeopleProvider {
    private db: StoredPerson[]

    constructor(initial: StoredPerson[]) {
        this.db = initial
    }

    createNew = async (creds: Credentials): Promise<Person> => {
        if (this.db.find(u => u.email === creds.email)) {
            throw new DuplicatePersonError(creds.email)
        }

        const maxId = Math.max(1, ...this.db.map(n => Number(n.id)).filter(n => !isNaN(n)))
        const newId = maxId + 1
        const newUser = {
            id: newId.toString(),
            email: creds.email,
            password: creds.password,
        }
        this.db.push(newUser)

        return this.toPublic(newUser)
    }

    authenticate = async (creds: Credentials): Promise<Person | null> => {
        const res = this.db.find(u => u.email === creds.email && u.password === creds.password)

        if (res) {
            return this.toPublic(res)
        } else {
            return null
        }
    }

    private toPublic = (stored: StoredPerson): Person => {
        return {
            id: stored.id,
            email: stored.email,
            token: jwt.sign({
                aud: 'authenticated',
                sub: stored.id,
                email: stored.email,
            }, SECRET),
        }
    }
}