'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Pin } from '@/lib/types'

interface PinCardProps {
  pin: Pin
  onDelete?: (id: string) => void
}

export default function PinCard({ pin, onDelete }: PinCardProps) {
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('Delete this pin?')) return
    setDeleting(true)
    const { error } = await supabase.from('pins').delete().eq('id', pin.id)
    if (error) {
      alert('Failed to delete pin: ' + error.message)
      setDeleting(false)
      return
    }
    onDelete?.(pin.id)
  }

  const hasCaption = pin.title || pin.note || pin.link_url

  return (
    <div className="break-inside-avoid mb-4 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pin.image_url}
          alt={pin.title ?? 'Pin'}
          className="w-full block"
          loading="lazy"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2Fsvg%22 width%3D%22400%22 height%3D%22300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23f3f4f6%22%2F%3E%3Ctext x%3D%22200%22 y%3D%22155%22 text-anchor%3D%22middle%22 fill%3D%22%239ca3af%22 font-size%3D%2214%22%3EImage unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'
          }}
        />
        {/* Delete button (hover reveal) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-white text-gray-600 hover:text-red-500 rounded-full shadow px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50"
            title="Delete pin"
          >
            {deleting ? '…' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Caption */}
      {hasCaption && (
        <div className="px-3 py-2.5 space-y-0.5">
          {pin.title && (
            <p className="font-semibold text-sm text-gray-900 leading-snug">{pin.title}</p>
          )}
          {pin.note && <p className="text-xs text-gray-500">{pin.note}</p>}
          {pin.link_url && (
            <a
              href={pin.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline block truncate"
            >
              {pin.link_url}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
