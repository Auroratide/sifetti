import nodeFetch from 'node-fetch'

type Fetch = (url: RequestInfo, init?: RequestInit) => Promise<Response>
type Cookies = { [name: string]: string }

const parseCookies = (raw: string[] = []): Cookies => {
    return raw.map(it => {
        const cookiePart = it.split(';')[0]
        const divider = cookiePart.indexOf('=')
        const name = cookiePart.substring(0, divider)
        const value = cookiePart.substring(divider + 1)
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
export const makeSugaryFetch = (): Fetch => {
    return function fetch(url, init) {
        this.cookies = this.cookies ?? {}

        // console.log('cookies', )

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
    }
}
