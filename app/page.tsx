import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Root route — immediately redirect based on auth state.
 * Authenticated  → /app
 * Unauthenticated → /login
 */
export default async function RootPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/app')
  } else {
    redirect('/login')
  }
}
