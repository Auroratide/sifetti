import type { Id as NoteId } from '../shared/notes/types'
import { getContext } from 'svelte'

export const linktoKey = Symbol()
export const linkto = () => getContext<LinkTo>(linktoKey) ?? new LinkTo()

/**
 * This class can be, perhaps rarely, overridden in certain contexts
 * to change where the links go. For example, on demo pages, the notes
 * links go to other demo pages and not to real note pages.
 */
export class LinkTo {
    note = (id: NoteId) => `/notes/${id}`
}
