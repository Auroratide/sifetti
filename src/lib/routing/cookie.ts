import * as cookie from 'cookie'

export const serialize = (name: string, value: string, options: cookie.CookieSerializeOptions = {}): string =>
    cookie.serialize(name, value, Object.assign({
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: true,
    }, options))
