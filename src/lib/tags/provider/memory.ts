import type { PeopleProvider } from '../../people/provider/provider'
import type { NotesProvider } from '../../notes/provider/provider'
import type { Person } from '../../people/types'
import type { Tag, TagId } from '../types'
import type { TagsProvider } from './provider'
import type { JwtToken } from '../../security/jwt'
import { nextId } from '../../provider/next-id'
import {
    DuplicateTagError,
    EmptyTagError,
    TagNotFoundError,
    NoteNotFoundError,
} from './error'
import type { Id as NoteId } from '../../notes/types'

export class MemoryTagsProvider implements TagsProvider {
    private people: PeopleProvider
    private notes: NotesProvider
    private db: Tag[]
    private associations: Record<NoteId, Set<TagId>>

    constructor(people: PeopleProvider, notes: NotesProvider, initial: Tag[] = [], associations: Record<NoteId, Set<TagId>> = {}) {
        this.people = people
        this.notes = notes
        this.db = initial
        this.associations = associations
    }

    create = (token: JwtToken, name: string): Promise<TagId> =>
        this.withPerson(token, async person => {
            if (name.length <= 0) {
                throw new EmptyTagError()
            }

            if (this.db.find(it => it.author === person.id && it.name === name)) {
                throw new DuplicateTagError(name)
            }

            const newId = nextId(this.db, it => it.id)
            const newItem: Tag = {
                id: newId,
                author: person.id,
                name: name,
            }

            this.db.push(newItem)

            return newId
        })

    getAll = (token: JwtToken): Promise<Tag[]> =>
        this.withPerson(token, async person => {
            return this.db.filter(it => it.author === person.id)
        })

    addToNote = (token: string, tag: TagId, note: NoteId): Promise<void> =>
        this.withPerson(token, async person => {
            if (!this.db.map(it => it.id).includes(tag))
                throw new TagNotFoundError(tag)
            if ((await this.notes.findById(note, token)) == null)
                throw new NoteNotFoundError(note)

            this.association(note).add(tag)
        })

    getForNote = (token: string, note: NoteId): Promise<Tag[]> =>
        this.withPerson(token, async person => {
            const association = this.association(note)

            return this.db
                .filter(it => it.author === person.id)
                .filter(it => association.has(it.id))
        })

    private withPerson = <T>(token: JwtToken, fn: (person: Person) => Promise<T>): Promise<T> =>
        this.people.getByToken(token).then(fn)

    private association = (note: NoteId): Set<TagId> => {
        this.associations[note] = this.associations[note] ?? new Set()
        return this.associations[note]
    }
}