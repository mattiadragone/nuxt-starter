import { createClient } from '@supabase/supabase-js'

export const getAdminSupabase = () => {
  const cfg = useRuntimeConfig()
  const url = cfg.public.supabaseUrl
  const serviceKey = cfg.supabaseServiceRoleKey
  if (!url || !serviceKey) throw new Error('Missing server Supabase configuration')
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}