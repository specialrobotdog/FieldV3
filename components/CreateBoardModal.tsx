'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Board } from '@/lib/types'

interface CreateBoardModalProps {
  onClose: () => void
  onCreated: (board: Board) => void
}

export default function CreateBoardModal({ onClose, onCreated }: CreateBoardModalProps) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Board name is required.')
      return
    }

    setLoading(true)
    setError('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Not authenticated.')
      setLoading(false)
      return
    }

    const { data, error: dbError } = await supabase
      .from('boards')
      .insert({ user_id: user.id, title: title.trim() })
      .select()
      .single()

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }

    onCreated(data as Board)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <h2 className="text-lg font-bold text-gray-900">Create Board</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Board Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Travel Inspo"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              autoFocus
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-500 text-white rounded-full py-2 text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
