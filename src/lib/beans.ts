import type { PeopleProvider } from './people/provider/provider'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { MemoryPeopleProvider } from './people/provider/memory'
import { SupabasePeopleProvider } from './people/provider/supabase'
import { peopleInMemory } from './people/in-memory/people'
import type { NotesProvider } from './notes/provider/provider'
import { MemoryNotesProvider } from './notes/provider/memory'
import { SupabaseNotesProvider } from './notes/provider/supabase'

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

export const notes: NotesProvider = ENVIRONMENT === 'integrated'
    ? new SupabaseNotesProvider({ url: VITE_ENV.VITE_SUPABASE_URL, key: VITE_ENV.VITE_SUPABASE_KEY })
    : new MemoryNotesProvider(people, [ {
        id: '1',
        author: peopleInMemory.aurora.id,
        content: '',
    } ])
