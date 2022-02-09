import { handle, withAuth, withJson } from '../_middleware'
import { tags } from '$lib/beans'
import * as endpoints from '$lib/routing/endpoints/tags/index'

export const get = handle(withAuth)(endpoints.get({ tags }))
export const post = handle(withAuth, withJson)(endpoints.post({ tags }))
