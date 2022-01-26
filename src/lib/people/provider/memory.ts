import type { Credentials, PeopleProvider, ProfileInfo } from './provider'
import { DuplicatePersonError } from './provider'
import type { JwtToken } from '$lib/security/jwt'
import type { Access, Person } from '../types'
import * as jwt from '../../security/jwt'
import { nextId } from '../../provider/next-id'
import { latency } from '../../provider/latency'
import type { ProfileName } from '../profile-name'
import { NameTakenError } from './error'

export type StoredPerson = {
    id: string,
    email: string,
    password: string,
    name?: ProfileName,
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

    createNew = async (creds: Credentials, info: ProfileInfo): Promise<Person> => {
        await latency()
        if (this.db.find(u => u.email === creds.email)) {
            throw new DuplicatePersonError(creds.email)
        }

        if (this.db.find(u => u.name && u.name.toLowerCase() === info.name?.toLowerCase())) {
            throw new NameTakenError(info.name)
        }

        const newId = nextId(this.db, it => it.id)
        const newUser = {
            id: newId.toString(),
            email: creds.email,
            password: creds.password,
            name: info.name,
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
        const oneDay = 1000 * 60 * 60 * 24
        return {
            token: jwt.sign({
                aud: 'authenticated',
                sub: stored.id,
                email: stored.email,
            }),
            expires: new Date(Date.now() + oneDay),
        }
    }

    private toPerson = (stored: StoredPerson): Person => {
        return {
            id: stored.id,
            email: stored.email,
            name: stored.name,
        }
    }
}