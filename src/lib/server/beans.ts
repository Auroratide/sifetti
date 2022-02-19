import type { SupabaseCredentials } from './provider/supabase-base'
import type { PeopleProvider } from '../shared/people/provider/provider'
import type { NotesProvider } from '../shared/notes/provider/provider'
import type { TagsProvider } from '../shared/tags/types/provider/provider'
import { MemoryPeopleProvider } from '../shared/people/provider/memory'
import { SupabasePeopleProvider } from './people/provider/supabase'
import { peopleInMemory } from './people/people-in-memory'
import { MemoryNotesProvider } from '../shared/notes/provider/memory'
import { SupabaseNotesProvider } from './notes/provider/supabase'
import { MemoryTagsProvider } from '../shared/tags/types/provider/memory'
import { SupabaseTagsProvider } from './tags/provider/supabase'
import { notesInMemory } from './notes/notes-in-memory'
import { tagsInMemory, noteTagsInMemory } from './tags/tags-in-memory'
import * as jwt from '../security/jwt'
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
    : new MemoryPeopleProvider(Object.values(peopleInMemory), {}, jwt.sign, env.local.latency)

export const tags: TagsProvider = ENVIRONMENT === 'integrated'
    ? new SupabaseTagsProvider(supabaseCredentials)
    : new MemoryTagsProvider(people, inMemoryNoteDb, Object.values(tagsInMemory), noteTagsInMemory)

export const notes: NotesProvider = ENVIRONMENT === 'integrated'
    ? new SupabaseNotesProvider(supabaseCredentials)
    : new MemoryNotesProvider(people, tags, inMemoryNoteDb)
