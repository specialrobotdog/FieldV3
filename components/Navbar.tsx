'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavbarProps {
  userEmail: string
}

export default function Navbar({ userEmail }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
    }`

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: brand + nav links */}
        <div className="flex items-center gap-6">
          <Link href="/app" className="font-bold text-xl text-red-500 tracking-tight">
            FieldV3
          </Link>
          <Link href="/app" className={linkClass('/app')}>
            Feed
          </Link>
          <Link href="/app/boards" className={linkClass('/app/boards')}>
            Boards
          </Link>
        </div>

        {/* Right: email + logout */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[200px]">
            {userEmail}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}
