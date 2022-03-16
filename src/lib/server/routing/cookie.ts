import * as cookie from 'cookie'

export type CookieKey = 'access_token' | 'refresh_token' | 'token_expiry'

export const parse = (str: string): Record<CookieKey, string> =>
    cookie.parse(str) as Record<CookieKey, string>

export const serialize = (name: CookieKey, value: string, options: cookie.CookieSerializeOptions = {}): string =>
    cookie.serialize(name, value, Object.assign({
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: true,
    }, options))
