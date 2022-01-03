import type { PeopleProvider } from './people/provider/provider'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { MemoryPeopleProvider } from './people/provider/memory'
import { SupabasePeopleProvider } from './people/provider/supabase'
import { peopleInMemory } from './people/in-memory/people'
import { NoteProvider } from './notes/note-provider'

type EnvironmentType = 'local' | 'integrated'
const ENVIRONMENT: EnvironmentType = process.env.ENVIRONMENT as EnvironmentType ?? 'local'

let supabase: SupabaseClient
if (ENVIRONMENT === 'integrated') {
    supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)
}

export const people: PeopleProvider = ENVIRONMENT === 'integrated'
    ? new SupabasePeopleProvider(supabase)
    : new MemoryPeopleProvider(Object.values(peopleInMemory))

export const notes: NoteProvider = new NoteProvider([ {
    id: '1',
    content: 'Hello world',
} ])
