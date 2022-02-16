import type { Credentials, PeopleProvider, ProfileInfo } from './provider'
import { DuplicatePersonError } from './provider'
import type { JwtToken } from '$lib/security/jwt'
import type { Access, Person, Id } from '../types'
import { nextId } from '../../provider/next-id'
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
    private sessions: Record<JwtToken, Id>
    private signJwt: (payload: object) => JwtToken
    private latency: () => Promise<void>

    constructor(initial: StoredPerson[], initialSessions: Record<JwtToken, Id>, signJwt: (payload: object) => JwtToken, latency: () => Promise<void> = () => Promise.resolve()) {
        this.db = initial
        this.sessions = initialSessions
        this.signJwt = signJwt
        this.latency = latency
    }

    createNew = async (creds: Credentials, info: ProfileInfo): Promise<Person> => {
        await this.latency()
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
        this.sessions[access.token] = newUser.id

        return this.toPerson(newUser)
    }

    authenticate = async (creds: Credentials): Promise<Access | null> => {
        await this.latency()
        const res = this.db.find(u => u.email === creds.email && u.password === creds.password)

        if (res) {
            const access = this.generateAccessTokens(res)
            this.sessions[access.token] = res.id

            return access
        } else {
            return null
        }
    }

    getByToken = async (token: JwtToken): Promise<Person | null> => {
        await this.latency()
        const session = this.sessions[token]
        return session != null
            ? this.toPerson(this.db.find(it => it.id === session))
            : null
    }

    invalidate = async (token: JwtToken): Promise<void> => {
        await this.latency()
        this.sessions[token] = null
    }

    resetPassword = async (token: JwtToken, newPassword: string): Promise<void> => {
        await this.latency()
        const session = this.sessions[token]

        this.db.find(u => u.id === session).password = newPassword
    }

    rename = async (token: JwtToken, newName: ProfileName): Promise<void> => {
        await this.latency()
        const session = this.sessions[token]

        this.db.find(u => u.id === session).name = newName
    }

    private generateAccessTokens = (stored: StoredPerson): Access => {
        const oneDay = 1000 * 60 * 60 * 24
        return {
            token: this.signJwt({
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