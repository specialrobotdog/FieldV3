'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Board, Pin } from '@/lib/types'

interface CreatePinModalProps {
  boards: Board[]
  defaultBoardId?: string
  onClose: () => void
  onCreated: (pin: Pin) => void
}

export default function CreatePinModal({
  boards,
  defaultBoardId,
  onClose,
  onCreated,
}: CreatePinModalProps) {
  const [imageUrl, setImageUrl] = useState('')
  const [title, setTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [note, setNote] = useState('')
  const [boardId, setBoardId] = useState(defaultBoardId ?? boards[0]?.id ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl.trim()) {
      setError('Image URL is required.')
      return
    }
    if (!boardId) {
      setError('Please select a board.')
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
      .from('pins')
      .insert({
        user_id: user.id,
        board_id: boardId,
        image_url: imageUrl.trim(),
        title: title.trim() || null,
        link_url: linkUrl.trim() || null,
        note: note.trim() || null,
      })
      .select()
      .single()

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }

    onCreated(data as Pin)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <h2 className="text-lg font-bold text-gray-900">Add a Pin</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              required
              autoFocus
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note…"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
          </div>

          {/* Board selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Board <span className="text-red-500">*</span>
            </label>
            <select
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
              required
            >
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.title}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Actions */}
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
              {loading ? 'Saving…' : 'Save Pin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
