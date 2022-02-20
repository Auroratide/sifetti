import { asType } from '../as-type'
import type { Tag } from '$lib/shared/tags/types'
import { TagName } from '$lib/shared/tags/types/tag-name'

export const buildTag = ({
    id = '1',
    author = '1',
    name = asType('tag', TagName),
}): Tag => ({ id, author, name })
