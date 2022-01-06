import type { Id, Note } from './types'
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
}
