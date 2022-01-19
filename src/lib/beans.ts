import type { PeopleProvider } from './people/provider/provider'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { MemoryPeopleProvider } from './people/provider/memory'
import { SupabasePeopleProvider } from './people/provider/supabase'
import { peopleInMemory } from './people/in-memory/people'
import type { NotesProvider } from './notes/provider/provider'
import { MemoryNotesProvider } from './notes/provider/memory'
import { SupabaseNotesProvider } from './notes/provider/supabase'
import type { TagsProvider } from './tags/provider/provider'
import { MemoryTagsProvider } from './tags/provider/memory'
import { SupabaseTagsProvider } from './tags/provider/supabase'
import { notesInMemory } from './notes/in-memory/notes'
import { tagsInMemory, noteTagsInMemory } from './tags/in-memory/tags'
import { env } from './env'

type EnvironmentType = 'local' | 'integrated'
const ENVIRONMENT: EnvironmentType = env.environment as EnvironmentType

let supabase: SupabaseClient
if (ENVIRONMENT === 'integrated') {
    supabase = createClient(env.supabase.url, env.supabase.key)
}

const inMemoryNoteDb = Object.values(notesInMemory)

export const people: PeopleProvider = ENVIRONMENT === 'integrated'
    ? new SupabasePeopleProvider(supabase)
    : new MemoryPeopleProvider(Object.values(peopleInMemory))

export const tags: TagsProvider = ENVIRONMENT === 'integrated'
    ? new SupabaseTagsProvider({ url: env.supabase.url, key: env.supabase.key })
    : new MemoryTagsProvider(people, inMemoryNoteDb, Object.values(tagsInMemory), noteTagsInMemory)

export const notes: NotesProvider = ENVIRONMENT === 'integrated'
    ? new SupabaseNotesProvider({ url: env.supabase.url, key: env.supabase.key })
    : new MemoryNotesProvider(people, tags, inMemoryNoteDb)
