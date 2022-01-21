import { getContext } from 'svelte'
import type { RandomGenerator } from './generators'
import { usingMath } from './generators'

export const key = Symbol()

export const generator = (): RandomGenerator => getContext(key) ?? usingMath()
