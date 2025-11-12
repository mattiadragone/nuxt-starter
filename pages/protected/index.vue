<template>
  <div class="space-y-2">
    <h1 class="text-xl font-semibold">Area protetta</h1>
    <p v-if="me">Sei loggato come <b>{{ me.email }}</b></p>
  </div>
</template>

<script setup lang="ts">
  const { signInWithPassword } = useAuth()

  const email = ref('')
  const password = ref('')   // ← riga corretta
  const loading = ref(false)
  const errorMsg = ref<string | null>(null)

  const submit = async () => {
    errorMsg.value = null
    loading.value = true
    try {
      const { error } = await signInWithPassword(email.value, password.value)
      if (error) throw error
      await navigateTo('/protected')
    } catch (e: any) {
      errorMsg.value = e?.message || 'Login failed'
    } finally {
      loading.value = false
    }
  }
</script>