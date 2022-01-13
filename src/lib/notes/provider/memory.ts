import type { PeopleProvider } from '../../people/provider/provider'
import type { TagsProvider } from '../../tags/provider/provider'
import type { Id, Note, EditableContent, WithTags } from '../types'
import type { NotesProvider } from './provider'
import type { JwtToken } from '../../security/jwt'
import { nextId } from '../../provider/next-id'

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
            .filter(note => note.author === person.id)
            .find(note => note.id === id) ?? null
    }

    getAll = async (token: JwtToken): Promise<(Note & WithTags)[]> => {
        const person = await this.people.getByToken(token)

        return await Promise.all(this.db.filter(note => note.author === person.id).map(async note => {
            const tags = await this.tags.getForNote(token, note.id)

            return {
                ...note,
                tags,
            }
        }))
    }

    replaceContent = async (id: string, token: string, content: EditableContent): Promise<void> => {
        const note = await this.findById(id, token)
        if (!note) {
            throw new Error('Note to edit does not exist')
        }

        note.title = content.title
        note.content = content.content
    }
}