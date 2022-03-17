import type { Access } from '$lib/shared/people/types'
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

export const remove = (name: CookieKey, options: cookie.CookieSerializeOptions = {}): string =>
    serialize(name, 'x', Object.assign(options, {
        expires: new Date(0),
    }))

export const serializeAccess = (access: Access) => [
    serialize('access_token', access.token, {
        expires: access.expires,
    }),
    serialize('refresh_token', access.refresh, {
        maxAge: 60 * 60 * 24 * 180, // 180 days
    }),
    serialize('token_expiry', access.expires.getTime().toString(), {
        maxAge: 60 * 60 * 24 * 180, // 180 days
    }),
]

export const removeAccess = () => [
    remove('access_token'),
    remove('refresh_token'),
    remove('token_expiry'),
]