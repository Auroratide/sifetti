import type { Tag } from './types'
import { Api } from '../api/api'

export class TagsApi extends Api {
    static BASE = '/api/tags'

    getAll = (): Promise<Tag[]> =>
        this.get(TagsApi.BASE)
            .then(res => res.json())
            .then(json => json.items)
}
