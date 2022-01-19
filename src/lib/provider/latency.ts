import { env } from '../env'

export const latency = (): Promise<void> => {
    if (env.local.latency === 0)
        return Promise.resolve()
    else
        return new Promise(resolve => setTimeout(resolve, env.local.latency))
}