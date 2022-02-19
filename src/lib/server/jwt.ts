import * as jwt from 'jsonwebtoken'
import type { JwtToken } from '../shared/jwt'
import { env } from './env'

export const sign = (payload: object): JwtToken => {
    return jwt.sign(payload, env.jwt.secret)
}
