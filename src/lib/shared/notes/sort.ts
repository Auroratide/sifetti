import type { EditableContent, TimestampMetadata } from './types'

export const ascending = (l: any, r: any) => l === r ? 0 : (l < r ? -1 : 1)
export const descending = (l: any, r: any) => l === r ? 0 : (l < r ? 1 : -1)

export const alphabetical = (direction: typeof ascending | typeof descending) =>
    (l: EditableContent, r: EditableContent) => direction(l.title.toLocaleLowerCase(), r.title.toLocaleLowerCase())

export const updateDate = (direction: typeof ascending | typeof descending) =>
    (l: TimestampMetadata, r: TimestampMetadata) => direction(l.updatedAt, r.updatedAt)