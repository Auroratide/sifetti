import type { JwtToken } from '$lib/shared/jwt'
import type { Access, Person } from '$lib/shared/people/types'
import type { ProfileName } from '$lib/shared/people/types/profile-name'

export type Credentials = {
    email: string,
    password: string,
}

export type ProfileInfo = {
    name: ProfileName,
}

export interface PeopleProvider {
    createNew: (creds: Credentials, info: ProfileInfo) => Promise<Person>,
    authenticate: (creds: Credentials) => Promise<Access | null>,
    refreshAccess: (refreshToken: string) => Promise<Access>,
    getByToken: (token: JwtToken) => Promise<Person | null>,
    invalidate: (token: JwtToken) => Promise<void>,
    resetPassword: (token: JwtToken, newPassword: string) => Promise<void>,
    rename: (token: JwtToken, newName: ProfileName) => Promise<void>,
}