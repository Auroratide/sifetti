import { notes } from '$lib/beans'
import { handle, withAuth } from '../../_middleware'
import * as endpoints from '$lib/routing/endpoints/notes/[id]/index'

export const get = handle(withAuth)(endpoints.get({ notes }))
