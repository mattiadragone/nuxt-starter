<template>
  <div class="space-y-4">
    <div class="space-y-1">
      <h1 class="text-xl font-semibold">{{ t('protected.title') }}</h1>
      <p v-if="isLoading" class="text-sm text-gray-500" role="status" aria-live="polite">{{ t('protected.loading') }}</p>
      <p v-else-if="me" class="text-sm" role="status" aria-live="polite">
        {{ t('protected.loggedInPrefix') }} <b>{{ me.email }}</b>
      </p>
      <p v-else class="text-sm text-red-600" role="alert" aria-live="assertive">{{ t('protected.noSession') }}</p>
    </div>

    <div v-if="me" class="space-y-2">
      <button
        class="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        :disabled="signingOut"
        @click="handleSignOut"
      >
        {{ signingOut ? t('protected.logoutBusy') : t('protected.logout') }}
      </button>
    </div>

    <p v-if="errorMsg" class="text-sm text-red-600" role="alert" aria-live="assertive">{{ errorMsg }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ShallowRef } from 'vue'
import type { User } from '@supabase/supabase-js'

const currentUser = inject<ShallowRef<User | null | undefined>>('currentUser', shallowRef(undefined))
const { signOut } = useAuth()
const { t } = useI18n()

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
    errorMsg.value = e?.message || t('protected.logoutError')
  } finally {
    signingOut.value = false
  }
}
</script>
