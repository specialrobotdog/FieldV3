'use client'

import { useState } from 'react'
import Link from 'next/link'
import PinCard from './PinCard'
import CreatePinModal from './CreatePinModal'
import type { Board, Pin } from '@/lib/types'

interface PinGridProps {
  initialPins: Pin[]
  boards: Board[]
}

export default function PinGrid({ initialPins, boards }: PinGridProps) {
  const [pins, setPins] = useState<Pin[]>(initialPins)
  const [showCreate, setShowCreate] = useState(false)

  const handlePinCreated = (pin: Pin) => {
    setPins((prev) => [pin, ...prev])
    setShowCreate(false)
  }

  const handlePinDeleted = (id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Feed</h1>
        <button
          onClick={() => setShowCreate(true)}
          disabled={boards.length === 0}
          title={boards.length === 0 ? 'Create a board first' : undefined}
          className="bg-red-500 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          + Add Pin
        </button>
      </div>

      {/* Empty states */}
      {boards.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 mb-2">No boards yet</p>
          <p className="text-sm text-gray-400">
            <Link href="/app/boards" className="text-red-500 hover:underline">
              Create a board
            </Link>{' '}
            first, then start saving pins.
          </p>
        </div>
      )}

      {boards.length > 0 && pins.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 mb-2">No pins yet</p>
          <p className="text-sm text-gray-400">Click &quot;+ Add Pin&quot; to save your first pin.</p>
        </div>
      )}

      {/* Masonry grid */}
      {pins.length > 0 && (
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
          {pins.map((pin) => (
            <PinCard key={pin.id} pin={pin} onDelete={handlePinDeleted} />
          ))}
        </div>
      )}

      {showCreate && (
        <CreatePinModal
          boards={boards}
          onClose={() => setShowCreate(false)}
          onCreated={handlePinCreated}
        />
      )}
    </>
  )
}
