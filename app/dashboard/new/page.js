'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  IconUpload,
  IconFileText,
  IconCalendar,
  IconUsers,
  IconBrain
} from '@tabler/icons-react'

export default function NewAnalysis() {
  const { data: session } = useSession()
  const router = useRouter()
  const [uploadMethod, setUploadMethod] = useState('file') // 'file' or 'text'
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    participants: '',
    transcript: '',
    file: null
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        file,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '')
      }))
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setFormData(prev => ({
        ...prev,
        file,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '')
      }))
    }
  }

  const canAnalyze = () => {
    if (!formData.title.trim()) return false
    if (uploadMethod === 'file' && !formData.file) return false
    if (uploadMethod === 'text' && !formData.transcript.trim()) return false
    return true
  }

  const handleAnalyze = async () => {
    if (!canAnalyze()) return

    setIsAnalyzing(true)

    // Simulate analysis processing
    setTimeout(() => {
      setIsAnalyzing(false)
      // In a real app, you would save the analysis and redirect to the results
      router.push('/dashboard/analyses')
    }, 3000)
  }

  const analysesUsed = session?.user?.analysesUsed || 0
  const canCreateAnalysis = analysesUsed < 5

  if (!canCreateAnalysis) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <IconBrain className="mr-2 h-6 w-6 text-yellow-500" />
              Analysis Limit Reached
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-400">
              You&apos;ve used all 5 of your free analyses this month. Upgrade to Pro for unlimited analyses.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="border-zinc-700 text-white hover:bg-zinc-800"
              >
                Back to Dashboard
              </Button>
              <Button
                disabled
                className="bg-zinc-700 text-zinc-400"
              >
                Upgrade to Pro (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">New Analysis</h1>
        <p className="text-zinc-400">
          Upload a meeting recording or paste your transcript to get started.
        </p>
      </div>

      {/* Upload Method Toggle */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Choose Input Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant={uploadMethod === 'file' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('file')}
              className={uploadMethod === 'file'
                ? 'bg-green-600 hover:bg-green-700 text-black'
                : 'border-zinc-700 text-white hover:bg-zinc-800'
              }
            >
              <IconUpload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
            <Button
              variant={uploadMethod === 'text' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('text')}
              className={uploadMethod === 'text'
                ? 'bg-green-600 hover:bg-green-700 text-black'
                : 'border-zinc-700 text-white hover:bg-zinc-800'
              }
            >
              <IconFileText className="mr-2 h-4 w-4" />
              Paste Transcript
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Section */}
      {uploadMethod === 'file' && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Upload Meeting Recording</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-green-600 bg-green-600/10'
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <IconUpload className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-white font-medium">
                  {formData.file ? formData.file.name : 'Drop your file here, or click to browse'}
                </p>
                <p className="text-sm text-zinc-400">
                  Supports .mp3, .mp4, .wav, .m4a, .txt files
                </p>
              </div>
              <input
                type="file"
                accept=".mp3,.mp4,.wav,.m4a,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Input Section */}
      {uploadMethod === 'text' && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Paste Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="transcript"
              value={formData.transcript}
              onChange={handleInputChange}
              placeholder="Paste your meeting transcript here..."
              className="min-h-[200px] bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 resize-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Meeting Details */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Meeting Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-zinc-400">
              Meeting Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Weekly Team Standup"
              className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-sm font-medium text-zinc-400">
                Meeting Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="participants" className="text-sm font-medium text-zinc-400">
                Participants
              </Label>
              <Input
                id="participants"
                name="participants"
                value={formData.participants}
                onChange={handleInputChange}
                placeholder="e.g., John, Sarah, Mike"
                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="border-zinc-700 text-white hover:bg-zinc-800"
        >
          Cancel
        </Button>
        <Button
          onClick={handleAnalyze}
          disabled={!canAnalyze() || isAnalyzing}
          className="bg-green-600 hover:bg-green-700 text-black font-semibold flex-1"
        >
          {isAnalyzing ? (
            <>
              <IconBrain className="mr-2 h-4 w-4 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <IconBrain className="mr-2 h-4 w-4" />
              Analyze Meeting
            </>
          )}
        </Button>
      </div>

      {/* Progress indicator */}
      {isAnalyzing && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <div>
                <p className="text-white font-medium">Processing your meeting...</p>
                <p className="text-sm text-zinc-400">This may take a few moments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}