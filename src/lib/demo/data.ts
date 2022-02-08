import type { ProfileName } from '../people/profile-name'

export const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoiMSIsImVtYWlsIjoiZGVtb0BzaWZldHRpLmNvbSJ9.nPynXfd13LN8-qUgiopwVc0wPpN70ZAzAaN1cHCf6Ns'

export const demoPerson = {
    id: '1',
    email: 'demo@sifetti.com',
    password: 'demo',
    name: 'Demo' as ProfileName,
}

export const demoNotes = [ {
    id: '1',
    author: demoPerson.id,
    title: 'Note',
    content: 'Hello!',
} ]

export const demoTags = [ {
    id: '1',
    author: demoPerson.id,
    name: 'tag',
} ]

export const demoNoteTags = {
    [demoNotes[0].id]: new Set([demoTags[0].id]),
}
