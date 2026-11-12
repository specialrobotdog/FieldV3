'use client'

import Link from 'next/link'
import { mockBoards } from '../mock-data'

export default function DemoBoardsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Boards</h1>
        <button className="bg-red-500 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors">
          + New Board
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockBoards.map((board) => (
          <div
            key={board.id}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group"
          >
            <Link href={`/demo/boards/${board.id}`} className="block">
              <h3 className="font-semibold text-gray-900 hover:text-red-500 transition-colors truncate">
                {board.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(board.created_at).toLocaleDateString()}
              </p>
            </Link>
            <button
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-xs text-gray-400 hover:text-red-500 transition-all px-2 py-1 rounded"
              title="Delete board"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
