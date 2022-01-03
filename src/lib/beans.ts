import type { PeopleProvider } from './people/provider/provider'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { MemoryPeopleProvider } from './people/provider/memory'
import { SupabasePeopleProvider } from './people/provider/supabase'
import { peopleInMemory } from './people/in-memory/people'
import { NoteProvider } from './notes/note-provider'

type EnvironmentType = 'local' | 'integrated'
const ENVIRONMENT: EnvironmentType = process.env.ENVIRONMENT as EnvironmentType ?? 'local'
// just because VSCode doesn't recognize env on meta
const VITE_ENV = (import.meta as any).env

let supabase: SupabaseClient
if (ENVIRONMENT === 'integrated') {
    supabase = createClient(VITE_ENV.VITE_SUPABASE_URL, VITE_ENV.VITE_SUPABASE_KEY)
}

export const people: PeopleProvider = ENVIRONMENT === 'integrated'
    ? new SupabasePeopleProvider(supabase)
    : new MemoryPeopleProvider(Object.values(peopleInMemory))

export const notes: NoteProvider = new NoteProvider([ {
    id: '1',
    content: 'Hello world',
} ])
