import { notes } from '$lib/beans'
import { handle, withAuth } from '../_middleware'
import * as endpoints from '$lib/server/endpoints/notes/index'

export const get = handle(withAuth)(endpoints.get({ notes }))
export const post = handle(withAuth)(endpoints.post({ notes }))
