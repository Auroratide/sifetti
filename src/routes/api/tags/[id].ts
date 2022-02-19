import { handle, withAuth } from '../_middleware'
import { tags } from '$lib/server/beans'
import * as endpoints from '$lib/shared/endpoints/tags/[id]'

export const get = handle(withAuth)(endpoints.get({ tags }))
