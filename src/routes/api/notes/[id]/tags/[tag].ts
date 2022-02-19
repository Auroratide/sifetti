import { handle, withAuth } from '../../../_middleware'
import { tags } from '$lib/server/beans'
import * as endpoints from '$lib/shared/endpoints/notes/[id]/tags/[tag]'

export const del = handle(withAuth)(endpoints.del({ tags }))