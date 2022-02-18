import type { PeopleProvider } from '../../people/provider/provider'
import type { TagsProvider } from '$lib/shared/tags/types/provider/provider'
import type { Id, Note, EditableContent, WithTags } from '../types'
import type { NotesProvider } from './provider'
import type { JwtToken } from '../../../security/jwt'
import type { Person } from '$lib/shared/people/types'
import { nextId } from '../../../provider/next-id'
import { MissingNoteError } from './error'

const sameAuthor = (person: Person) => (note: Note) => note.author === person.id
const sameNote = (id: Id) => (note: Note) => note.id === id

export class MemoryNotesProvider implements NotesProvider {
    private people: PeopleProvider
    private tags: TagsProvider
    private db: Note[]

    constructor(people: PeopleProvider, tags: TagsProvider, initial: Note[] = []) {
        this.people = people
        this.tags = tags
        this.db = initial
    }

    createEmpty = async (token: JwtToken): Promise<string> => {
        const person = await this.people.getByToken(token)

        const newId = nextId(this.db, it => it.id)
        const newNote = {
            id: newId.toString(),
            author: person.id,
            title: '',
            content: '',
        }

        this.db.push(newNote)

        return newNote.id
    }

    findById = async (id: string, token: JwtToken): Promise<Note | null> => {
        const person = await this.people.getByToken(token)

        return this.db
            .filter(sameAuthor(person))
            .find(sameNote(id)) ?? null
    }

    getAll = async (token: JwtToken): Promise<(Note & WithTags)[]> => {
        const person = await this.people.getByToken(token)

        return await Promise.all(this.db
            .filter(sameAuthor(person))
            .map(this.withTagsForNote(token))
        )
    }

    replaceContent = async (id: string, token: string, content: EditableContent): Promise<void> => {
        const note = await this.findById(id, token)
        if (!note) {
            throw new MissingNoteError(id)
        }

        note.title = content.title
        note.content = content.content
    }

    private withTagsForNote = (token: JwtToken) => async (note: Note): Promise<Note & WithTags> => {
        const tags = await this.tags.getForNote(token, note.id)

        return {
            ...note,
            tags,
        }
    }
}