import type { Provisioner } from '../db'
import { NOTES } from './name'

export const cleanNotes = (provisioner: Provisioner, accounts: Record<string, { id: string }>) =>
    provisioner.exec(client => client.from(NOTES)
        .delete()
        .or(`user_id.eq.${accounts.alpha.id},user_id.eq.${accounts.beta.id}`))
