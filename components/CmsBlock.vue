<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    slug: string
    as?: string
    class?: string
    fallback?: string
  }>(),
  { as: 'div', fallback: '' }
)

const slug = toRef(props, 'slug')
const asTag = toRef(props, 'as')
const className = toRef(props, 'class')
const fallback = toRef(props, 'fallback')

const { data, pending, error } = await useCms(slug, { server: true, lazy: true })

const content = computed(() => data.value?.bySlug?.[slug.value]?.content || null)
</script>

<template>
  <component :is="asTag || 'div'" :class="className">
    <span v-if="pending">Loading…</span>
    <span v-else-if="error">{{ fallback || '' }}</span>
    <span v-else-if="content" v-html="content" />
    <span v-else>{{ fallback }}</span>
  </component>
</template>
