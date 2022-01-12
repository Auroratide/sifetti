import type { EditableContent, Id, Note } from './types'
import type { Tag, TagId } from '../tags/types'
import { Api } from '../api/api'
import { HttpStatus } from '../routing/http-status'
import { ApiError } from '../api/error'

export type NoteIdentification = {
    id: Id,
    api: string,
    view: string,
}

export class NotesApi extends Api {
    static BASE = '/api/notes'

    create = async (): Promise<NoteIdentification> => {
        return this.post(NotesApi.BASE).then(res => {
            const api = res.headers.get('Location')

            return {
                id: api.substring(`${NotesApi.BASE}/`.length),
                api: api,
                view: api.substring('/api'.length),
            }
        })
    }

    getById = async (id: Id): Promise<Note | null> =>
        this.get(`${NotesApi.BASE}/${id}`)
            .then(res => res.json())
            .catch(err => {
                if (err instanceof ApiError && err.info.status === HttpStatus.NotFound) {
                    return null
                }

                throw err
            })
    
    getAll = async (): Promise<Note[]> =>
        this.get(NotesApi.BASE)
            .then(res => res.json())
            .then(json => json.items)

    getTags = (id: Id): Promise<Tag[]> =>
        this.get(`${NotesApi.BASE}/${id}/tags`)
            .then(res => res.json())
            .then(json => json.items)

    edit = async (id: Id, content: EditableContent): Promise<void> =>
        this.post(`${NotesApi.BASE}/${id}/edits`, content).then(() => {})

    addTag = (id: Id, tag: TagId): Promise<void> =>
        this.post(`${NotesApi.BASE}/${id}/tags`, {
            tagId: tag,
        }).then(() => {})
}
