import type { SupabaseCredentials } from './provider/supabase-base'
import type { PeopleProvider } from './people/provider/provider'
import type { NotesProvider } from './notes/provider/provider'
import type { TagsProvider } from './tags/provider/provider'
import { MemoryPeopleProvider } from './people/provider/memory'
import { SupabasePeopleProvider } from './people/provider/supabase'
import { peopleInMemory } from './people/in-memory/people'
import { MemoryNotesProvider } from './notes/provider/memory'
import { SupabaseNotesProvider } from './notes/provider/supabase'
import { MemoryTagsProvider } from './tags/provider/memory'
import { SupabaseTagsProvider } from './tags/provider/supabase'
import { notesInMemory } from './notes/in-memory/notes'
import { tagsInMemory, noteTagsInMemory } from './tags/in-memory/tags'
import * as jwt from './security/jwt'
import { latency } from './provider/latency'
import { env } from './env'

type EnvironmentType = 'local' | 'integrated'
const ENVIRONMENT: EnvironmentType = env.environment as EnvironmentType

let supabaseCredentials: SupabaseCredentials
if (ENVIRONMENT === 'integrated') {
    supabaseCredentials = { url: env.supabase.url, key: env.supabase.key }
}

const inMemoryNoteDb = Object.values(notesInMemory)

export const people: PeopleProvider = ENVIRONMENT === 'integrated'
    ? new SupabasePeopleProvider(supabaseCredentials)
    : new MemoryPeopleProvider(Object.values(peopleInMemory), jwt.sign, latency)

export const tags: TagsProvider = ENVIRONMENT === 'integrated'
    ? new SupabaseTagsProvider(supabaseCredentials)
    : new MemoryTagsProvider(people, inMemoryNoteDb, Object.values(tagsInMemory), noteTagsInMemory)

export const notes: NotesProvider = ENVIRONMENT === 'integrated'
    ? new SupabaseNotesProvider(supabaseCredentials)
    : new MemoryNotesProvider(people, tags, inMemoryNoteDb)
