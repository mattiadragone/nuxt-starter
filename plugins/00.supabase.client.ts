import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

type AuthApi = SupabaseClient['auth']

type SignInParams = Parameters<AuthApi['signInWithPassword']>[0]

type SignInResult = ReturnType<AuthApi['signInWithPassword']>

type SignOutResult = ReturnType<AuthApi['signOut']>

type GetSessionResult = ReturnType<AuthApi['getSession']>

type OnAuthStateChangeResult = ReturnType<AuthApi['onAuthStateChange']>

export default defineNuxtPlugin(() => {
  const cfg = useRuntimeConfig()
  const url = cfg.public?.supabaseUrl
  const key = cfg.public?.supabaseAnonKey

  if (!url || !key) {
    if (process.client) {
      console.warn('[Supabase] Missing env: NUXT_PUBLIC_SUPABASE_URL / NUXT_PUBLIC_SUPABASE_ANON_KEY')
    }

    const stub = {
      from: () => ({
        select: async () => {
          throw new Error('Supabase not configured: set envs in .env')
        },
      }),
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }) as Awaited<GetSessionResult>,
        signInWithOtp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: async (_params: SignInParams) =>
          ({ data: null, error: new Error('Supabase not configured') }) as Awaited<SignInResult>,
        signOut: async () => ({ error: null }) as Awaited<SignOutResult>,
        onAuthStateChange: () =>
          ({ data: { subscription: { unsubscribe: () => {} } } }) as Awaited<OnAuthStateChangeResult>,
      },
    }

    return { provide: { supabase: stub } }
  }

  const supabase = createClient(url, key)
  return { provide: { supabase } }
})
