import type { Id, Note } from './types'

export class NoteProvider {
    private db: Note[]

    constructor(initial: Note[]) {
        this.db = initial
    }

    getAll = (): Note[] => {
        return this.db
    }

    createEmpty = (): Id => {
        const maxId = Math.max(...this.db.map(n => Number(n.id)).filter(n => !isNaN(n)))
        const newId = maxId + 1
        this.db.push({
            id: newId.toString(),
            content: '',
        })

        return newId.toString()
    }

    findById = (id: Id): Note | null => {
        return this.db.find(n => n.id === id) ?? null
    }

    edit = (id: Id, content: string) => {
        const obj = this.findById(id)

        if (obj) {
            obj.content = content
        }
    }
}
