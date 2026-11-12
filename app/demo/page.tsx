'use client'

import { mockPins, mockBoards } from './mock-data'

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

export default function DemoFeedPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Feed</h1>
        <button className="bg-red-500 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors">
          + Add Pin
        </button>
      </div>
      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {mockPins.map((pin) => (
          <DemoPinCard key={pin.id} pin={pin} />
        ))}
      </div>
    </>
  )
}
