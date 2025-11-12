<template>
  <div ref="box" class="mt-4 h-24 rounded-xl border bg-white grid place-items-center">
    <span class="text-sm">GSAP animated box</span>
  </div>
</template>
<script setup lang="ts">
const box = ref<HTMLElement | null>(null)
const { $gsap } = useNuxtApp()
onMounted(()=>{
  const gsap:any = ($gsap as any)
  if(!gsap){ if(process.client) console.warn('[GSAP] $gsap not available'); return }
  if(box.value && typeof gsap.fromTo==='function'){ gsap.fromTo(box.value,{opacity:0,y:20},{opacity:1,y:0,duration:0.6}) }
})
</script>
