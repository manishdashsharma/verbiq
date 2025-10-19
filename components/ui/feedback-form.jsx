'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  IconStar,
  IconBug,
  IconBulb,
  IconMessageCircle,
  IconLoader2,
  IconCheck
} from '@tabler/icons-react'

export default function FeedbackForm({ onClose, onSuccess }) {
  const { data: session } = useSession()
  const [type, setType] = useState('feedback')
  const [title, setTitle] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [stars, setStars] = useState(5)
  const [priority, setPriority] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!session) {
      setError('Please sign in to submit feedback')
      return
    }

    setLoading(true)
    setError('')

    try {
      const payload = {
        type,
        feedbackText,
      }

      if (type === 'feedback') {
        payload.stars = stars
      }

      if (type === 'bugReport' || type === 'featureRequest') {
        payload.title = title
      }

      if (type === 'bugReport') {
        payload.priority = priority
      }

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback')
      }

      setSuccess(true)
      setTimeout(() => {
        if (onSuccess) onSuccess()
        if (onClose) onClose()
      }, 2000)

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'bugReport':
        return <IconBug className="h-5 w-5 text-red-500" />
      case 'featureRequest':
        return <IconBulb className="h-5 w-5 text-yellow-500" />
      default:
        return <IconMessageCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'bugReport':
        return 'Bug Report'
      case 'featureRequest':
        return 'Feature Request'
      default:
        return 'Feedback'
    }
  }

  if (success) {
    return (
      <div className="group relative max-w-md mx-auto">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse"></div>
        <Card className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800/50 rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-600 rounded-full blur-md opacity-50"></div>
                <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-4">
                  <IconCheck className="h-8 w-8 text-black" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Thank you!</h3>
            <p className="text-zinc-300 leading-relaxed">
              Your {getTypeLabel().toLowerCase()} has been submitted successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="group relative max-w-md mx-auto">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse"></div>
      <Card className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800/50 rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-white text-xl">
            <div className="relative">
              <div className="absolute inset-0 bg-green-600/20 rounded-lg blur-sm"></div>
              <div className="relative p-2 rounded-lg bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50">
                {getTypeIcon()}
              </div>
            </div>
            Share Your {getTypeLabel()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label className="text-zinc-300 font-medium">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-zinc-800/50 backdrop-blur-sm border-zinc-700/50 text-white hover:border-green-500/30 transition-colors rounded-xl h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-700/50 rounded-xl">
                <SelectItem value="feedback" className="text-white hover:bg-zinc-800/50 rounded-lg margin-1">
                  <div className="flex items-center gap-3">
                    <IconMessageCircle className="h-4 w-4 text-green-400" />
                    Feedback
                  </div>
                </SelectItem>
                <SelectItem value="bugReport" className="text-white hover:bg-zinc-800/50 rounded-lg margin-1">
                  <div className="flex items-center gap-3">
                    <IconBug className="h-4 w-4 text-red-400" />
                    Bug Report
                  </div>
                </SelectItem>
                <SelectItem value="featureRequest" className="text-white hover:bg-zinc-800/50 rounded-lg margin-1">
                  <div className="flex items-center gap-3">
                    <IconBulb className="h-4 w-4 text-yellow-400" />
                    Feature Request
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title for Bug Reports and Feature Requests */}
          {(type === 'bugReport' || type === 'featureRequest') && (
            <div className="space-y-2">
              <Label className="text-zinc-300 font-medium">
                {type === 'bugReport' ? 'Bug Title' : 'Feature Title'}
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === 'bugReport' ? 'Brief description of the bug' : 'What feature would you like?'}
                className="bg-zinc-800/50 backdrop-blur-sm border-zinc-700/50 text-white hover:border-green-500/30 focus:border-green-500/50 transition-colors rounded-xl h-12"
                required
              />
            </div>
          )}

          {/* Priority for Bug Reports */}
          {type === 'bugReport' && (
            <div className="space-y-2">
              <Label className="text-zinc-300 font-medium">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="bg-zinc-800/50 backdrop-blur-sm border-zinc-700/50 text-white hover:border-red-500/30 transition-colors rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-700/50 rounded-xl">
                  <SelectItem value="low" className="text-white hover:bg-zinc-800/50 rounded-lg margin-1">Low</SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-zinc-800/50 rounded-lg margin-1">Medium</SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-zinc-800/50 rounded-lg margin-1">High</SelectItem>
                  <SelectItem value="critical" className="text-white hover:bg-zinc-800/50 rounded-lg margin-1">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Star Rating for Feedback */}
          {type === 'feedback' && (
            <div className="space-y-3">
              <Label className="text-zinc-300 font-medium">Rating</Label>
              <div className="flex gap-2 p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setStars(rating)}
                    className="p-2 hover:scale-110 transition-all duration-200 rounded-lg hover:bg-yellow-500/10"
                  >
                    <IconStar
                      className={`h-7 w-7 transition-all duration-200 ${
                        rating <= stars
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                          : 'text-zinc-600 hover:text-zinc-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description/Content */}
          <div className="space-y-2">
            <Label className="text-zinc-300 font-medium">
              {type === 'bugReport'
                ? 'Bug Description'
                : type === 'featureRequest'
                ? 'Feature Description'
                : 'Your Feedback'
              }
            </Label>
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={
                type === 'bugReport'
                  ? 'Please describe the bug in detail, including steps to reproduce...'
                  : type === 'featureRequest'
                  ? 'Describe the feature you would like to see added...'
                  : 'Share your thoughts about VerbIQ...'
              }
              className="bg-zinc-800/50 backdrop-blur-sm border-zinc-700/50 text-white min-h-[120px] hover:border-green-500/30 focus:border-green-500/50 transition-colors rounded-xl resize-none"
              required
            />
          </div>

          {error && (
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-xl blur opacity-20"></div>
              <div className="relative p-4 bg-red-900/30 border border-red-700/50 rounded-xl backdrop-blur-sm">
                <p className="text-red-300 font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-zinc-700/50 text-white hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-200 rounded-xl h-12 backdrop-blur-sm"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-black font-bold rounded-xl h-12 shadow-lg hover:shadow-green-500/25 transition-all duration-200"
            >
              {loading ? (
                <>
                  <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                `Submit ${getTypeLabel()}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}