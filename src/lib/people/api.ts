import type { Person } from './types'
import { Api } from '../api/api'

export class PeopleApi extends Api {
    static SIGN_IN = '/api/people/sign-ins'
    static SIGN_UP = '/api/people'
    static EVENTS = '/api/people/auth-events'

    signIn = async (email: string, password: string): Promise<Person> => {
        const res = await this.post(PeopleApi.SIGN_IN, {
            email,
            password,
        })

        return (await res.json()).person
    }

    signUp = async (email: string, password: string): Promise<void> => {
        return await this.post(PeopleApi.SIGN_UP, {
            email,
            password
        }).then(() => {})
    }

    signOut = async (): Promise<void> => {
        return await this.del(PeopleApi.SIGN_IN).then(() => {})
    }

    authEvent = (type: string, info: {
        accessToken: string,
        expiresIn: number,
        refreshToken: string,
    }): Promise<string> =>
        this.post(PeopleApi.EVENTS, Object.assign({}, info, { type })).then(res => {
            return res.headers.get('Location')
        })

    resetPassword = async (): Promise<void> => {

    }
}
