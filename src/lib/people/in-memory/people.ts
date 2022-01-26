import type { ProfileName } from '../profile-name'

export type PersonInMemory = {
    id: string,
    email: string,
    password: string,
    name: ProfileName,
}

export const peopleInMemory = {
    aurora: {
        id: '1',
        email: 'aurora@sifetti.com',
        password: 'bluegreen',
        name: 'Aurora' as ProfileName,
    },
    eventide: {
        id: '2',
        email: 'eventide@sifetti.com',
        password: 'redblack',
        name: 'Eventide' as ProfileName,
    },
}
