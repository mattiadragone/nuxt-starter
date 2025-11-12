<script setup lang="ts">
import GsapDemo from '~/components/GsapDemo.client.vue'

type DemoItem = { id: number; name: string }
type PingResponse = { ok: boolean; ts: number }
type CmsItem = { id: string; slug: string; content: string; published: boolean }
type CmsResponse = { ok: boolean; items?: CmsItem[]; bySlug?: Record<string, CmsItem | null>; error?: string }

const output = ref<string>('')
const { $supabase } = useNuxtApp()
const { t } = useI18n()

const ping = async () => {
  const res = await $fetch<PingResponse>('/api/ping').catch(e => ({ ok: false, ts: 0, error: String(e) } as any))
  output.value = JSON.stringify(res, null, 2)
}

const loadDemoItems = async () => {
  try {
    const { data, error } = await $supabase.from('demo_items').select('id,name').limit(5)
    if (error) throw error
    output.value = JSON.stringify({ ok: true, data: data as DemoItem[] }, null, 2)
  } catch (e: any) {
    output.value = JSON.stringify({ ok: false, error: e.message || String(e) }, null, 2)
  }
}

const fetchCms = async () => {
  const res = await $fetch<CmsResponse>('/api/cms').catch(e => ({ ok: false, error: String(e) }))
  output.value = JSON.stringify(res, null, 2)
}
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-xl border bg-white p-4 shadow-sm">
      <h2 class="text-lg font-semibold">{{ t('home.title') }}</h2>
      <p class="text-sm text-gray-600">{{ t('home.subtitle') }}</p>

      <div class="flex gap-2 mt-3">
        <button class="px-3 py-2 rounded bg-black text-white" @click="ping">{{ t('home.buttons.ping') }}</button>
        <button class="px-3 py-2 rounded bg-black text-white" @click="loadDemoItems">{{ t('home.buttons.demoItems') }}</button>
        <button class="px-3 py-2 rounded bg-black text-white" @click="fetchCms">{{ t('home.buttons.cms') }}</button>
      </div>
      <p class="mt-2 text-xs text-gray-600">
        {{ t('home.envNotice') }}
      </p>
    </div>

    <GsapDemo />

    <div class="rounded-xl border bg-white p-4 shadow-sm">
      <h3 class="text-base font-semibold">{{ t('home.resultsTitle') }}</h3>
      <pre class="text-xs whitespace-pre-wrap">{{ output }}</pre>
    </div>
  </div>
</template>
