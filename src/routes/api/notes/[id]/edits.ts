import { notes } from '$lib/server/beans'
import { handle, withAuth, withJson } from '../../_middleware'
import * as endpoints from '$lib/shared/endpoints/notes/[id]/edits'

export const post = handle(withAuth, withJson)(endpoints.post({ notes }))
