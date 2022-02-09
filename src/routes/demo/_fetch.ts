import { createDemoFetch } from '$lib/demo/fetch'
import { createDemoProviders } from '$lib/demo/providers'
import { readable } from 'svelte/store'

export const demoFetch = readable(createDemoFetch(createDemoProviders()))
