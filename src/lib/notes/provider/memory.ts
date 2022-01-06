import type { PeopleProvider } from '../../people/provider/provider'
import type { Id, Note, EditableContent } from '../types'
import type { NotesProvider } from './provider'
import type { JwtToken } from '../../security/jwt'

export class MemoryNotesProvider implements NotesProvider {
    private people: PeopleProvider
    private db: Note[]

    constructor(people: PeopleProvider, initial: Note[] = []) {
        this.people = people
        this.db = initial
    }

    createEmpty = async (token: JwtToken): Promise<string> => {
        const person = await this.people.getByToken(token)

        const maxId = Math.max(1, ...this.db.map(n => Number(n.id)).filter(n => !isNaN(n)))
        const newId = maxId + 1
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

    getAll = async (token: JwtToken): Promise<Note[]> => {
        const person = await this.people.getByToken(token)

        return this.db.filter(note => note.author === person.id)
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