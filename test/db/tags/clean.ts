import type { Provisioner } from '../db'
import { TAGS } from './name'

export const cleanTags = (provisioner: Provisioner, accounts: Record<string, { id: string}>) =>
    provisioner.exec(c => c.from(TAGS)
        .delete()
        .or(`author_id.eq.${accounts.alpha.id},author_id.eq.${accounts.beta.id}`))
