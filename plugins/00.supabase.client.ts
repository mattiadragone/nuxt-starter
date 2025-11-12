import { createClient } from '@supabase/supabase-js'
export default defineNuxtPlugin(()=>{
  const cfg = useRuntimeConfig()
  const url = cfg.public?.supabaseUrl
  const key = cfg.public?.supabaseAnonKey
  if(!url || !key){
    if(process.client) console.warn('[Supabase] Missing env: NUXT_PUBLIC_SUPABASE_URL / NUXT_PUBLIC_SUPABASE_ANON_KEY')
    const stub:any={
      from:()=>({ select:async()=>{ throw new Error('Supabase not configured: set envs in .env') } }),
      auth:{
        getSession:async()=>({data:{session:null},error:null}),
        signInWithOtp:async()=>({data:null,error:new Error('Supabase not configured')}),
        signOut:async()=>({error:null}),
        onAuthStateChange:()=>({data:{subscription:{unsubscribe:()=>{}}},error:null})
      }
    }
    return { provide: { supabase: stub } }
  }
  const supabase=createClient(url,key)
  return { provide: { supabase } }
})
