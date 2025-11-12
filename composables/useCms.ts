type CmsItem = { id: string; slug: string; content: string; published: boolean }
type CmsData = { ok: boolean; items?: CmsItem[]; bySlug?: Record<string, CmsItem|null>; error?: string }

export function useCms(slugs: string | string[], opts?: { lazy?: boolean; server?: boolean }) {
  const list = Array.isArray(slugs) ? slugs : [slugs]
  const key = `cms:${list.sort().join(',') || 'all'}`
  const params = list.length ? { slugs: list.join(',') } : {}
  return useAsyncData<CmsData>(
    key,
    () => $fetch('/api/cms', { params }),
    { server: opts?.server ?? true, lazy: opts?.lazy ?? true }
  )
}