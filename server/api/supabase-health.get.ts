export default defineEventHandler(async () => {
  const cfg = useRuntimeConfig()
  const url = cfg.public.supabaseUrl
  const anon = cfg.public.supabaseAnonKey
  if (!url || !anon) return { ok: false, error: 'Missing public Supabase config' }
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, anon)
  try {
    const { error } = await supabase.from('demo_items').select('id').limit(1)
    if (error) throw error
    return { ok: true }
  } catch (e:any) {
    return { ok: false, error: e.message || String(e) }
  }
})
