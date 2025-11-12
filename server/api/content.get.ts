import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const cfg = useRuntimeConfig()
  const url = cfg.public.supabaseUrl
  const serviceKey = cfg.supabaseServiceRoleKey

  if (!url || !serviceKey) {
    return { ok: false, error: 'Missing server Supabase configuration' }
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })
  try {
    const { data, error } = await supabase
      .from('cms_blocks')
      .select('id,slug,content,published')
      .eq('published', true)
      .limit(5)
    if (error) throw error
    return { ok: true, items: data }
  } catch (e: any) {
    return { ok: false, error: e.message || String(e) }
  }
})
