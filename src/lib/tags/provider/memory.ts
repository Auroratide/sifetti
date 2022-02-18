import type { PeopleProvider } from '../../people/provider/provider'
import type { Person } from '$lib/shared/people/types'
import type { Note } from '../../shared/notes/types'
import type { Tag, TagId } from '$lib/shared/tags/types'
import type { TagsProvider } from './provider'
import type { JwtToken } from '../../security/jwt'
import { nextId } from '../../provider/next-id'
import {
    DuplicateTagError,
    EmptyTagError,
    TagNotOnNoteError,
    NoteOrTagNotFoundError,
    InvalidTagError,
} from './error'
import type { Id as NoteId } from '../../shared/notes/types'
import { TagName } from '$lib/shared/tags/types/tag-name'
import { isLeft } from 'fp-ts/lib/Either.js'

export class MemoryTagsProvider implements TagsProvider {
    private people: PeopleProvider
    private notes: Note[]
    private db: Tag[]
    private associations: Record<NoteId, Set<TagId>>

    constructor(people: PeopleProvider, notes: Note[], initial: Tag[] = [], associations: Record<NoteId, Set<TagId>> = {}) {
        this.people = people
        this.notes = notes
        this.db = initial
        this.associations = associations
    }

    create = (token: JwtToken, name: TagName): Promise<TagId> =>
        this.withPerson(token, async person => {
            if (name.length <= 0) {
                throw new EmptyTagError()
            }

            if (this.db.find(it => it.author === person.id && it.name === name)) {
                throw new DuplicateTagError(name)
            }

            if (isLeft(TagName.decode(name))) {
                throw new InvalidTagError(name)
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
                throw new NoteOrTagNotFoundError(note, tag)
            if (this.notes.find(it => it.id === note) == null)
                throw new NoteOrTagNotFoundError(note, tag)

            this.association(note).add(tag)
        })

    getForNote = (token: string, note: NoteId): Promise<Tag[]> =>
        this.withPerson(token, async person => {
            const association = this.association(note)

            return this.db
                .filter(it => it.author === person.id)
                .filter(it => association.has(it.id))
        })

    removeFromNote = (token: string, tag: TagId, note: NoteId): Promise<void> =>
        this.withPerson(token, async person => {
            const association = this.association(note)
            if (association.has(tag)) {
                association.delete(tag)
            } else {
                throw new TagNotOnNoteError(tag, note)
            }
        })

    private withPerson = <T>(token: JwtToken, fn: (person: Person) => Promise<T>): Promise<T> =>
        this.people.getByToken(token).then(fn)

    private association = (note: NoteId): Set<TagId> => {
        this.associations[note] = this.associations[note] ?? new Set()
        return this.associations[note]
    }
}
