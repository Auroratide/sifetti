import type { SupabaseClient } from '@supabase/supabase-js'
import { TAGS } from './name'

export const cleanTags = (client: SupabaseClient, accounts: Record<string, { id: string}>) =>
    client.from(TAGS)
        .delete()
        .or(`author_id.eq.${accounts.alpha.id},author_id.eq.${accounts.beta.id}`)
