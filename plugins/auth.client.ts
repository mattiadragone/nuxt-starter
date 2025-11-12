import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { useState } from '#imports'

type AuthListener = ReturnType<SupabaseClient['auth']['onAuthStateChange']>
type AuthSubscription = AuthListener['data']['subscription'] | null

export default defineNuxtPlugin(async (nuxtApp) => {
  const user = useState<Session['user'] | null>('auth-user', () => null)
  const supabase = (nuxtApp as unknown as { $supabase?: SupabaseClient }).$supabase

  if (!supabase?.auth) {
    if (process.client) {
      console.warn('[Auth] $supabase not available; auth idle.')
    }

    return { provide: { currentUser: user } }
  }

  const syncUser = (session: Session | null) => {
    user.value = session?.user ?? null
  }

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error('[Auth] getSession() failed:', error)
    } else {
      syncUser(data?.session ?? null)
    }
  } catch (err) {
    console.error('[Auth] getSession() threw:', err)
  }

  let subscription: AuthSubscription = null

  const { data: authListener, error: listenerError } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      syncUser(session)
    }
  )

  if (listenerError) {
    console.error('[Auth] onAuthStateChange failed:', listenerError)
  }

  subscription = authListener?.subscription ?? null

  const unsubscribe = () => {
    if (!subscription) {
      return
    }

    try {
      subscription.unsubscribe()
    } catch (err) {
      console.error('[Auth] Failed to unsubscribe from auth listener:', err)
    } finally {
      subscription = null
    }
  }

  nuxtApp.hook('app:beforeUnmount', unsubscribe)

  if (import.meta.hot) {
    import.meta.hot.dispose(unsubscribe)
  }

  return { provide: { currentUser: user } }
})
