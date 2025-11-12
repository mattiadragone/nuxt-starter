<template>
  <div class="rounded-xl border bg-white p-4 shadow-sm">
    <h2 class="text-lg font-semibold">{{ title }}</h2>
    <p v-if="subtitle" class="text-sm text-gray-600">{{ subtitle }}</p>
    <div class="mt-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>
