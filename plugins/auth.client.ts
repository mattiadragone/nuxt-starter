import { useState } from '#imports'

export default defineNuxtPlugin((nuxtApp)=>{
  const user = useState<any>('auth-user', () => null)
  const supa:any = (nuxtApp as any).$supabase
  if(!supa || !supa.auth){
    if(process.client) console.warn('[Auth] $supabase not available; auth idle.')
    return { provide: { currentUser: user } }
  }

  const syncUser = (session:any)=>{ user.value = session?.user ?? null }

  supa.auth.getSession()
    .then(({ data, error }:any)=>{
      if(error){
        console.error('[Auth] getSession() failed:', error)
        return
      }
      syncUser(data?.session)
    })
    .catch((err:unknown)=>{
      console.error('[Auth] getSession() threw:', err)
    })

  const { data: authListener, error: listenerError }:any = supa.auth.onAuthStateChange((_e:any, session:any)=>{
    syncUser(session)
  })

  if(listenerError){
    console.error('[Auth] onAuthStateChange failed:', listenerError)
  }

  const subscription = authListener?.subscription

  if(subscription){
    nuxtApp.hook('app:beforeUnmount', ()=>{
      subscription.unsubscribe()
    })
  }

  return { provide: { currentUser: user } }
})
