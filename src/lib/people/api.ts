import type { Person } from './types'
import { Api } from '../api/api'

export class PeopleApi extends Api {
    static SIGN_IN = '/api/people/sign-ins'

    signIn = async (email: string, password: string): Promise<Person> => {
        const res = await this.post(PeopleApi.SIGN_IN, {
            email,
            password,
        })

        return (await res.json()).person
    }
}
