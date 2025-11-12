import { setHeader } from 'h3'
import { getAdminSupabase } from '~/server/utils/supabase'

type CmsItem = { id: string; slug: string; content: string; published: boolean }
type CmsResponse = { ok: boolean; items?: CmsItem[]; bySlug?: Record<string, CmsItem|null>; error?: string }

export default defineEventHandler(async (event): Promise<CmsResponse> => {
  try {
    // Cache lato server (SWR): 60s hard + 300s stale
    setHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')

    const q = getQuery(event)
    const raw =
      (Array.isArray(q.slugs) ? q.slugs.join(',') : (q.slugs as string)) ||
      (q.slug as string) || ''
    const slugs = raw.split(',').map(s => s.trim()).filter(Boolean)

    const supabase = getAdminSupabase()

    let data: CmsItem[] = []
    if (slugs.length) {
      const { data: rows, error } = await supabase
        .from('cms_blocks')
        .select('id,slug,content,published')
        .in('slug', slugs)
        .eq('published', true)
        .limit(slugs.length)
      if (error) throw error
      data = rows ?? []
    } else {
      const { data: rows, error } = await supabase
        .from('cms_blocks')
        .select('id,slug,content,published')
        .eq('published', true)
        .limit(50)
      if (error) throw error
      data = rows ?? []
    }

    const bySlug: Record<string, CmsItem|null> = {}
    if (slugs.length) {
      for (const s of slugs) bySlug[s] = data.find(d => d.slug === s) ?? null
    }

    return { ok: true, items: data, bySlug }
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) }
  }
})