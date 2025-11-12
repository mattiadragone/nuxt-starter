// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-11-11',
  typescript: {
    strict: true
  },
  nitro: {
    preset: 'vercel'
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'it',
    strategy: 'no_prefix',
    langDir: 'locales',
    locales: [
      { code: 'it', iso: 'it-IT', file: 'it.json', name: 'Italiano' }
    ]
  },
  runtimeConfig: {
    // PRIVATE (server only)
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    // PUBLIC (client-exposed)
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
    }
  }
})
