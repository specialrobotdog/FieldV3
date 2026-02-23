'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import CreateBoardModal from '@/components/CreateBoardModal'
import type { Board } from '@/lib/types'

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const supabase = createClient()

  const fetchBoards = useCallback(async () => {
    const { data } = await supabase
      .from('boards')
      .select('*')
      .order('created_at', { ascending: false })
    setBoards(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  const handleBoardCreated = (board: Board) => {
    setBoards((prev) => [board, ...prev])
    setShowCreate(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this board and all its pins?')) return
    await supabase.from('boards').delete().eq('id', id)
    setBoards((prev) => prev.filter((b) => b.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400 text-sm">Loading boards…</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Boards</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-red-500 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors"
        >
          + New Board
        </button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 mb-2">No boards yet</p>
          <p className="text-sm text-gray-400">
            Create your first board to start organising pins.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <Link href={`/app/boards/${board.id}`} className="block">
                <h3 className="font-semibold text-gray-900 hover:text-red-500 transition-colors truncate">
                  {board.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(board.created_at).toLocaleDateString()}
                </p>
              </Link>
              <button
                onClick={() => handleDelete(board.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-xs text-gray-400 hover:text-red-500 transition-all px-2 py-1 rounded"
                title="Delete board"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateBoardModal
          onClose={() => setShowCreate(false)}
          onCreated={handleBoardCreated}
        />
      )}
    </>
  )
}
