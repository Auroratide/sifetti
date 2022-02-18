import { handle, withAuth } from '../../../_middleware'
import { tags } from '$lib/beans'
import * as endpoints from '$lib/server/endpoints/notes/[id]/tags/[tag]'

export const del = handle(withAuth)(endpoints.del({ tags }))