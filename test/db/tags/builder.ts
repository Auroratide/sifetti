import type { TagTableRow } from "./types";

export const buildTag = ({
    author_id,
    name = 'name',
}: TagTableRow) => ({
    author_id, name,
})
