import type { SupabaseClient } from '@supabase/supabase-js'
import { NOTES } from './name'

export const cleanNotes = (client: SupabaseClient, accounts: Record<string, { id: string }>) =>
    client.from(NOTES)
        .delete()
        .or(`user_id.eq.${accounts.alpha.id},user_id.eq.${accounts.beta.id}`)
