'use client'

import { mockPins, mockBoards } from '../mock-data'

function DemoPinCard({ pin }: { pin: typeof mockPins[0] }) {
  const hasCaption = pin.title || pin.note || pin.link_url

  return (
    <div className="break-inside-avoid mb-4 bg-white rounded-2xl overflow-hidden shadow-sm group">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pin.image_url} alt={pin.title ?? 'Pin'} className="w-full block" loading="lazy" />
      </div>
      {hasCaption && (
        <div className="px-3 py-2.5 space-y-0.5">
          {pin.title && <p className="font-semibold text-sm text-gray-900 leading-snug">{pin.title}</p>}
          {pin.note && <p className="text-xs text-gray-500">{pin.note}</p>}
        </div>
      )}
    </div>
  )
}

export default function DemoCreatePage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Feed</h1>
        <button className="bg-red-500 text-white rounded-full px-4 py-2 text-sm font-medium">
          + Add Pin
        </button>
      </div>
      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {mockPins.map((pin) => (
          <DemoPinCard key={pin.id} pin={pin} />
        ))}
      </div>

      {/* Static modal overlay */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
          <div className="flex items-center justify-between px-6 pt-5 pb-1">
            <h2 className="text-lg font-bold text-gray-900">Add a Pin</h2>
            <button className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors" aria-label="Close">
              ×
            </button>
          </div>
          <div className="px-6 pb-6 pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="Optional title"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
              <input
                type="url"
                placeholder="https://example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea
                placeholder="Optional note…"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Board <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                defaultValue={mockBoards[0]?.id}
              >
                {mockBoards.map((board) => (
                  <option key={board.id} value={board.id}>{board.title}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <button className="flex-1 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button className="flex-1 bg-red-500 text-white rounded-full py-2 text-sm font-medium hover:bg-red-600 transition-colors">
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
