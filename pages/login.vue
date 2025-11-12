<script setup lang="ts">
const { signInWithPassword } = useAuth()
const { t } = useI18n()

const email = ref('')
const password = ref('')
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
    errorMsg.value = e?.message || t('login.errorFallback')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto space-y-4">
    <h1 class="text-xl font-semibold">{{ t('login.title') }}</h1>

    <label class="block">
      <span class="text-sm">{{ t('login.emailLabel') }}</span>
      <input v-model="email" type="email" class="w-full border rounded p-2" autocomplete="email" />
    </label>

    <label class="block">
      <span class="text-sm">{{ t('login.passwordLabel') }}</span>
      <input v-model="password" type="password" class="w-full border rounded p-2" autocomplete="current-password" />
    </label>

    <button class="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
            :disabled="loading || !email || !password"
            @click="submit">
      {{ t('login.submit') }}
    </button>

    <p v-if="errorMsg" class="text-red-600 text-sm" role="alert" aria-live="assertive">{{ errorMsg }}</p>
  </div>
</template>
