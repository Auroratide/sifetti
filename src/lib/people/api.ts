import type { Person } from './types'
import { Api } from '../api/api'

export class PeopleApi extends Api {
    static SIGN_IN = '/api/people/sign-ins'
    static SIGN_UP = '/api/people'

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
}
