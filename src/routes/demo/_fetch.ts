import { createDemoFetch } from '$lib/client/demo/fetch'
import { createDemoProviders } from '$lib/client/demo/providers'
import { readable } from 'svelte/store'

export const demoFetch = readable(createDemoFetch(createDemoProviders()))
