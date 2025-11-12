export function useAuth() {
  const { $supabase } = useNuxtApp()
  const signInWithPassword = (email: string, password: string) =>
    $supabase.auth.signInWithPassword({ email, password })
  const signOut = () => $supabase.auth.signOut()
  return { signInWithPassword, signOut }
}