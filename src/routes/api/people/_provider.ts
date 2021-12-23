import { MemoryPeopleProvider } from '$lib/people/provider/memory'

export const people = new MemoryPeopleProvider([ {
    id: '1',
    email: 'aurora@sifetti.com',
    password: 'bluegreen',
} ])
