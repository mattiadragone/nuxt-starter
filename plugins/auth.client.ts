export default defineNuxtPlugin((nuxtApp)=>{
  const user = shallowRef<any>(null)
  const supa:any = (nuxtApp as any).$supabase
  if(!supa || !supa.auth){
    if(process.client) console.warn('[Auth] $supabase not available; auth idle.')
    return { provide: { currentUser: user } }
  }
  supa.auth.getSession().then(({data}:any)=>{ user.value = data?.session?.user ?? null })
  supa.auth.onAuthStateChange((_e:any, session:any)=>{ user.value = session?.user ?? null })
  return { provide: { currentUser: user } }
})