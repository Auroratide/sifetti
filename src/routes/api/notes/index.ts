import { notes } from '$lib/server/beans'
import { handle, withAuth } from '../_middleware'
import * as endpoints from '$lib/shared/endpoints/notes/index'

export const get = handle(withAuth)(endpoints.get({ notes }))
export const post = handle(withAuth)(endpoints.post({ notes }))
