<template>
  <div class="space-y-4">
    <div class="space-y-1">
      <h1 class="text-xl font-semibold">Area protetta</h1>
      <p v-if="isLoading" class="text-sm text-gray-500">Caricamento in corso…</p>
      <p v-else-if="me" class="text-sm">Sei loggato come <b>{{ me.email }}</b></p>
      <p v-else class="text-sm text-red-600">Sessione non trovata, reindirizzamento…</p>
    </div>

    <div v-if="me" class="space-y-2">
      <button
        class="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        :disabled="signingOut"
        @click="handleSignOut"
      >
        {{ signingOut ? 'Logout…' : 'Logout' }}
      </button>
    </div>

    <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ShallowRef } from 'vue'
import type { User } from '@supabase/supabase-js'

const currentUser = inject<ShallowRef<User | null | undefined>>('currentUser', shallowRef(undefined))
const { signOut } = useAuth()

const isLoading = computed(() => currentUser.value === undefined)
const me = computed<User | null>(() => (currentUser.value && !isLoading.value ? currentUser.value : null))

const signingOut = ref(false)
const errorMsg = ref<string | null>(null)

watchEffect(() => {
  if (!isLoading.value && !me.value) {
    navigateTo('/login')
  }
})

const handleSignOut = async () => {
  errorMsg.value = null
  signingOut.value = true
  try {
    const { error } = await signOut()
    if (error) throw error
    await navigateTo('/login')
  } catch (e: any) {
    errorMsg.value = e?.message || 'Logout fallito'
  } finally {
    signingOut.value = false
  }
}
</script>
