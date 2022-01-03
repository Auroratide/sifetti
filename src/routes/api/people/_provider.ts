import { peopleInMemory } from './_in-memory/_people'
import { MemoryPeopleProvider } from '$lib/people/provider/memory'

export const people = new MemoryPeopleProvider(Object.values(peopleInMemory))
