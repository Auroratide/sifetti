import nodeFetch from 'node-fetch'

type Fetch = (url: RequestInfo, init?: RequestInit) => Promise<Response>
type Cookies = { [name: string]: string }
export type FetchBinder = {
    cookies?: Cookies
}

const parseCookies = (raw: string[] = []): Cookies => {
    return raw.map(it => {
        const cookiePart = it.split(';')[0]
        const divider = cookiePart.indexOf('=')
        const name = cookiePart.substring(0, divider)
        let value = cookiePart.substring(divider + 1)

        // cookie invalidation
        const expires = it.match(/expires\s*=\s*.+?;/i)
        if (expires) {
            let datePart = expires[0].split('=')[1]
            datePart = datePart.substring(0, datePart.length - 1) // the semicolon
            if (Date.parse(datePart) < new Date().getTime())
                value = null
        }

        return { [name]: value }
    }).reduce((cookies, cur) => ({
        ...cookies,
        ...cur,
    }), {})
}

const serializeCookies = (cookies: Cookies): string => {
    return Object.entries(cookies)
        .map(([name, value]) => `${name}=${value}`)
        .join(';')
}

/**
 * This instruments fetch with the ability to send cookies that were set.
 * This is because node-fetch does not do this automatically.
 * 
 * @returns A fetch that likes eating cookies
 */
export const makeSugaryFetch = (binder: FetchBinder = {}): Fetch => {
    return (async function fetch(url: RequestInfo, init?: RequestInit) {
        this.cookies = this.cookies ?? {}

        return nodeFetch(url as any, {
            ...init,
            headers: {
                ...init?.headers ?? {},
                'cookie': serializeCookies(this.cookies),
            },
        } as any).then(res => {
            this.cookies = {
                ...this.cookies,
                ...parseCookies(res.headers.raw()['set-cookie'])
            }

            return res as unknown as Response
        })
    }).bind(binder)
}
