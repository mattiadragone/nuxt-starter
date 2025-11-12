<script setup lang="ts">

import GsapDemo from '~/components/GsapDemo.client.vue'

type DemoItem = { id: number; name: string }
type PingResponse = { ok: boolean; ts: number }
type CmsItem = { id: string; slug: string; content: string; published: boolean }

const output = ref<string>('')
const { $supabase } = useNuxtApp()

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
  const res = await $fetch<{ ok: boolean; items?: CmsItem[]; error?: string }>('/api/content')
    .catch(e => ({ ok: false, error: String(e) }))
  output.value = JSON.stringify(res, null, 2)
}
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-xl border bg-white p-4 shadow-sm">
      <h2 class="text-lg font-semibold">Nuxt + Supabase + GSAP starter</h2>
      <p class="text-sm text-gray-600">Minimal demo</p>

      <div class="flex gap-2 mt-3">
        <button class="px-3 py-2 rounded bg-black text-white" @click="ping">Ping API</button>
        <button class="px-3 py-2 rounded bg-black text-white" @click="loadDemoItems">Test Supabase (client)</button>
        <button class="px-3 py-2 rounded bg-black text-white" @click="fetchCms">Fetch CMS (server)</button>
      </div>
      <p class="mt-2 text-xs text-gray-600">
        Env not set? Client calls will show handled errors.
      </p>
    </div>

    <GsapDemo />

    <div class="rounded-xl border bg-white p-4 shadow-sm">
      <h3 class="text-base font-semibold">Results</h3>
      <pre class="text-xs whitespace-pre-wrap">{{ output }}</pre>
    </div>
  </div>
</template>