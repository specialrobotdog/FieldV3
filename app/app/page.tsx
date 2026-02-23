import { createClient } from '@/lib/supabase/server'
import PinGrid from '@/components/PinGrid'
import type { Pin, Board } from '@/lib/types'

export default async function FeedPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: pins }, { data: boards }] = await Promise.all([
    supabase
      .from('pins')
      .select('*, boards(id, title)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('boards')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <PinGrid
      initialPins={(pins ?? []) as Pin[]}
      boards={(boards ?? []) as Board[]}
    />
  )
}
