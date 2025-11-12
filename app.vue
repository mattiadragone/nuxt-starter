<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <header class="p-4 border-b bg-white sticky top-0 z-10">
      <nav class="max-w-3xl mx-auto flex items-center gap-4">
        <NuxtLink to="/" class="font-semibold">Home</NuxtLink>
        <NuxtLink to="/protected" class="hover:underline">Protected</NuxtLink>
      </nav>
    </header>
    <main class="max-w-3xl mx-auto p-6">
      <NuxtPage />
    </main>
  </div>
  <CmsBlock
      slug="footer-note"
      as="footer"
      class="mt-16 border-t py-8 text-center text-sm text-gray-600"
      fallback="© Site — All rights reserved"
    />
</template>

<script setup lang="ts">
const { data: cmsBoot } = await useCms(['footer-note', 'home-hero'], { server: true, lazy: false })
</script>
