export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/protected')) return
  const { $supabase } = useNuxtApp()
  const { data } = await $supabase.auth.getSession()
  if (!data?.session) return navigateTo('/login')
})