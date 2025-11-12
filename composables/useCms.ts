import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

type CmsItem = { id: string; slug: string; content: string; published: boolean }
type CmsData = { ok: boolean; items?: CmsItem[]; bySlug?: Record<string, CmsItem | null>; error?: string }

export function useCms(
  slugs: MaybeRefOrGetter<string | string[]>,
  opts?: { lazy?: boolean; server?: boolean }
) {
  const list = computed(() => {
    const value = toValue(slugs)
    const entries = Array.isArray(value) ? value : value ? [value] : []
    return entries
  })

  const key = computed(() => `cms:${[...list.value].sort().join(',') || 'all'}`)
  const params = computed(() => (list.value.length ? { slugs: list.value.join(',') } : {}))

  return useAsyncData<CmsData>(
    () => key.value,
    () => $fetch('/api/cms', { params: params.value }),
    {
      server: opts?.server ?? true,
      lazy: opts?.lazy ?? true,
      watch: [list],
    }
  )
}
