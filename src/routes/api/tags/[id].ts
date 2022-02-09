import { handle, withAuth } from '../_middleware'
import { tags } from '$lib/beans'
import * as endpoints from '$lib/routing/endpoints/tags/[id]'

export const get = handle(withAuth)(endpoints.get({ tags }))
