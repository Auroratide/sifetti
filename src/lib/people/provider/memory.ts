import type { Credentials, PeopleProvider } from './provider'
import { DuplicatePersonError } from './provider'
import type { JwtToken } from '$lib/security/jwt'
import type { Access, Person } from '../types'
import * as jwt from '../../security/jwt'
import { nextId } from '../../provider/next-id'
import { latency } from '../../provider/latency'

export type StoredPerson = {
    id: string,
    email: string,
    password: string,
}

/**
 * For use in a local environment only because it
 * STORES PASSWORDS IN PLAINTEXT. NEVER DO THAT in prod.
 * Also it's ephemeral.
 */
export class MemoryPeopleProvider implements PeopleProvider {
    private db: StoredPerson[]
    private sessions: Record<JwtToken, Person>

    constructor(initial: StoredPerson[]) {
        this.db = initial
        this.sessions = {}
    }

    createNew = async (creds: Credentials): Promise<Person> => {
        await latency()
        if (this.db.find(u => u.email === creds.email)) {
            throw new DuplicatePersonError(creds.email)
        }

        const newId = nextId(this.db, it => it.id)
        const newUser = {
            id: newId.toString(),
            email: creds.email,
            password: creds.password,
        }
        this.db.push(newUser)

        const access = this.generateAccessTokens(newUser)
        this.sessions[access.token] = this.toPerson(newUser)

        return this.sessions[access.token]
    }

    authenticate = async (creds: Credentials): Promise<Access | null> => {
        await latency()
        const res = this.db.find(u => u.email === creds.email && u.password === creds.password)

        if (res) {
            const access = this.generateAccessTokens(res)
            this.sessions[access.token] = this.toPerson(res)

            return access
        } else {
            return null
        }
    }

    getByToken = async (token: JwtToken): Promise<Person | null> => {
        await latency()
        return this.sessions[token] ?? null
    }

    invalidate = async (token: JwtToken): Promise<void> => {
        await latency()
        this.sessions[token] = null
    }

    resetPassword = async (token: string, newPassword: string): Promise<void> => {
        await latency()
        const session = this.sessions[token]

        this.db.find(u => u.email === session.email).password = newPassword
    }

    private generateAccessTokens = (stored: StoredPerson): Access => {
        return {
            token: jwt.sign({
                aud: 'authenticated',
                sub: stored.id,
                email: stored.email,
            }),
        }
    }

    private toPerson = (stored: StoredPerson): Person => {
        return {
            id: stored.id,
            email: stored.email,
        }
    }
}