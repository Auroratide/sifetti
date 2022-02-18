import type { Tag, TagId } from '$lib/shared/tags/types'
import { Api } from '../api/api'
import { ApiError } from '../api/error'
import { HttpStatus } from '../../routing/http-status'

export class TagsApi extends Api {
    static BASE = '/api/tags'

    getAll = (): Promise<Tag[]> =>
        this.get(TagsApi.BASE)
            .then(res => res.json())
            .then(json => json.items)

    getOne = async (id: TagId): Promise<Tag | null> =>
        this.get(`${TagsApi.BASE}/${id}`)
            .then(res => res.json())
            .catch(err => {
                if (err instanceof ApiError && err.info.status === HttpStatus.NotFound) {
                    return null
                }

                throw err
            })

    create = (name: string): Promise<TagId> =>
        this.post(TagsApi.BASE, { name })
            .then(res => res.headers.get('Location').substring(`${TagsApi.BASE}/`.length))
}
