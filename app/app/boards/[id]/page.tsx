'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PinCard from '@/components/PinCard'
import CreatePinModal from '@/components/CreatePinModal'
import type { Board, Pin } from '@/lib/types'

export default function BoardDetailPage() {
  const { id: boardId } = useParams<{ id: string }>()
  const [board, setBoard] = useState<Board | null>(null)
  const [pins, setPins] = useState<Pin[]>([])
  const [allBoards, setAllBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const [{ data: boardData }, { data: pinsData }, { data: boardsData }] = await Promise.all([
      supabase.from('boards').select('*').eq('id', boardId).maybeSingle(),
      supabase
        .from('pins')
        .select('*')
        .eq('board_id', boardId)
        .order('created_at', { ascending: false }),
      supabase.from('boards').select('*').order('created_at', { ascending: false }),
    ])

    if (!boardData) {
      setNotFound(true)
    } else {
      setBoard(boardData)
    }
    setPins(pinsData ?? [])
    setAllBoards(boardsData ?? [])
    setLoading(false)
  }, [boardId, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handlePinCreated = (pin: Pin) => {
    // Only prepend if the pin belongs to this board
    if (pin.board_id === boardId) {
      setPins((prev) => [pin, ...prev])
    }
    setShowCreate(false)
  }

  const handlePinDeleted = (id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-400 mb-4">Board not found</p>
        <Link href="/app/boards" className="text-red-500 hover:underline text-sm">
          ← Back to boards
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link href="/app/boards" className="hover:text-gray-600 transition-colors">
          Boards
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{board?.title}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{board?.title}</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-red-500 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors"
        >
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
            <PinCard key={pin.id} pin={pin} onDelete={handlePinDeleted} />
          ))}
        </div>
      )}

      {showCreate && (
        <CreatePinModal
          boards={allBoards}
          defaultBoardId={boardId}
          onClose={() => setShowCreate(false)}
          onCreated={handlePinCreated}
        />
      )}
    </>
  )
}
