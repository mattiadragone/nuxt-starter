<script setup lang="ts">
const props = withDefaults(defineProps<{
  slug: string
  as?: string
  class?: string
  fallback?: string
}>(), { as: 'div', fallback: '' })

const { data, pending, error } = await useCms(props.slug, { server: true, lazy: true })
const Tag = resolveComponent(props.as) as any
const content = computed(() => data.value?.bySlug?.[props.slug]?.content || null)
</script>

<template>
  <component :is="as" :class="class">
    <span v-if="pending">Loading…</span>
    <span v-else-if="error">{{ fallback || '' }}</span>
    <span v-else-if="content" v-html="content" />
    <span v-else>{{ fallback }}</span>
  </component>
</template>