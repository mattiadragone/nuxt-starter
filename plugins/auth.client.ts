import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  const user = shallowRef<User | null | undefined>(undefined)
  const supa: any = (nuxtApp as any).$supabase

  if (!supa || !supa.auth) {
    if (process.client) {
      console.warn('[Auth] $supabase not available; auth idle.')
    }
    user.value = null
    return { provide: { currentUser: user } }
  }

  const setUser = (session: Session | null) => {
    user.value = session?.user ?? null
  }

  supa.auth
    .getSession()
    .then(({ data, error }: { data: { session: Session | null } | null; error: any }) => {
      if (error) {
        console.error('[Auth] Failed to retrieve initial session', error)
        user.value = null
        return
      }
      setUser(data?.session ?? null)
    })
    .catch((err: any) => {
      console.error('[Auth] Unexpected error while fetching session', err)
      user.value = null
    })

  const { data: listener } = supa.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
    setUser(session)
  })

  if (listener?.subscription) {
    nuxtApp.hook('app:unmounted', () => {
      listener.subscription.unsubscribe()
    })

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        listener.subscription.unsubscribe()
      })
    }
  }

  return { provide: { currentUser: user } }
})
