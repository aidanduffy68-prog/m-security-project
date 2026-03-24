'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'

export default function PostFlag({ postId }: { postId: string }) {
  const [flagged, setFlagged] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleFlag = () => {
    setFlagged(true)
    setShowModal(false)
    // In production, this would send to moderation queue
    console.log('Post flagged:', postId)
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-1 text-sm ${
          flagged ? 'text-cantina-orange' : 'text-gray-500 hover:text-gray-300'
        } transition`}
        disabled={flagged}
      >
        <Flag className="w-4 h-4" />
        {flagged ? 'Flagged' : 'Flag'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Flag Post</h3>
            <p className="text-gray-400 mb-6">
              This will report the post to moderators for review. False reports may result in account restrictions.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleFlag}
                className="flex-1 px-4 py-2 bg-cantina-orange hover:bg-cantina-orange/80 rounded-md font-medium transition"
              >
                Confirm Flag
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
