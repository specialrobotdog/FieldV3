'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
    }`

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/demo" className="font-bold text-xl text-red-500 tracking-tight">
              FieldV3
            </Link>
            <Link href="/demo" className={linkClass('/demo')}>
              Feed
            </Link>
            <Link href="/demo/boards" className={linkClass('/demo/boards')}>
              Boards
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hidden sm:block">demo@example.com</span>
            <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Log out
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
