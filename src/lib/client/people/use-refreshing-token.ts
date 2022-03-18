import type { PeopleApi } from './api'
import { session } from '$app/stores'
import { onDestroy } from 'svelte'

/**
 * Requests new tokens on a steady interval so that as long as a window is open
 * the session stays live.
 * 
 * Ultimately, this should be replaced with an on-demand refresh which only kicks
 * in when the token is expired or about to expire.
 */
export const useRefreshingToken = (api: PeopleApi) => {
    let interval = undefined
    let unsubscribe = session.subscribe((value) => {
        clearInterval(interval)

        if (value.person != null) {
            const fifteenMinutes = 1000 * 60 * 15
            interval = setInterval(() => api.requestNewTokens(), fifteenMinutes)
        }
    })

    onDestroy(() => {
        clearInterval(interval)
        unsubscribe()
    })
}
