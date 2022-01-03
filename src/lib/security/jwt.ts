import * as jwt from 'jsonwebtoken'

const SECRET = process.env.SUPABASE_KEY

export type JwtToken = string

export const sign = (payload: object): JwtToken => {
    return jwt.sign(payload, SECRET)
}
