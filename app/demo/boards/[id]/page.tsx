'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { mockBoards, mockPins } from '../../mock-data'

function DemoPinCard({ pin }: { pin: typeof mockPins[0] }) {
  const hasCaption = pin.title || pin.note || pin.link_url

  return (
    <div className="break-inside-avoid mb-4 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pin.image_url} alt={pin.title ?? 'Pin'} className="w-full block" loading="lazy" />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white text-gray-600 hover:text-red-500 rounded-full shadow px-2.5 py-1 text-xs font-medium transition-colors">
            Delete
          </button>
        </div>
      </div>
      {hasCaption && (
        <div className="px-3 py-2.5 space-y-0.5">
          {pin.title && <p className="font-semibold text-sm text-gray-900 leading-snug">{pin.title}</p>}
          {pin.note && <p className="text-xs text-gray-500">{pin.note}</p>}
          {pin.link_url && (
            <span className="text-xs text-blue-500 block truncate">{pin.link_url}</span>
          )}
        </div>
      )}
    </div>
  )
}

export default function DemoBoardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const board = mockBoards.find((b) => b.id === id)
  const pins = mockPins.filter((p) => p.board_id === id)

  if (!board) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-400 mb-4">Board not found</p>
        <Link href="/demo/boards" className="text-red-500 hover:underline text-sm">
          ← Back to boards
        </Link>
      </div>
    )
  }

  return (
    <>
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link href="/demo/boards" className="hover:text-gray-600 transition-colors">
          Boards
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{board.title}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
        <button className="bg-red-500 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors">
          + Add Pin
        </button>
      </div>

      {pins.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 mb-2">No pins yet</p>
          <p className="text-sm text-gray-400">Click &quot;+ Add Pin&quot; to save your first pin.</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
          {pins.map((pin) => (
            <DemoPinCard key={pin.id} pin={pin} />
          ))}
        </div>
      )}
    </>
  )
}
