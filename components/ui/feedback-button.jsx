'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import FeedbackForm from '@/components/ui/feedback-form'
import { IconMessageCircle, IconX } from '@tabler/icons-react'

export default function FeedbackButton() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    setIsOpen(false)
  }

  // Don't show feedback button if user is not logged in
  if (!session) {
    return null
  }

  return (
    <>
      {/* Floating Feedback Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-black font-semibold rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          size="lg"
        >
          <IconMessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 z-10 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full p-2 border border-zinc-600"
            >
              <IconX className="h-4 w-4" />
            </button>
            <FeedbackForm
              onClose={() => setIsOpen(false)}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}
    </>
  )
}