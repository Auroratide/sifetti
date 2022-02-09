import { notes } from '$lib/beans'
import { handle, withAuth, withJson } from '../../_middleware'
import * as endpoints from '$lib/routing/endpoints/notes/[id]/edits'

export const post = handle(withAuth, withJson)(endpoints.post({ notes }))
