import * as jwt from 'jsonwebtoken'

const vite = (import.meta as any).env
const SECRET = vite ? vite.VITE_SUPABASE_KEY : process.env.SUPABASE_KEY

export type JwtToken = string

export const sign = (payload: object): JwtToken => {
    return jwt.sign(payload, SECRET)
}
