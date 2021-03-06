import { handle, withAuth, withJson } from '../_middleware'
import { tags } from '$lib/server/beans'
import * as endpoints from '$lib/shared/endpoints/tags/index'

export const get = handle(withAuth)(endpoints.get({ tags }))
export const post = handle(withAuth, withJson)(endpoints.post({ tags }))
