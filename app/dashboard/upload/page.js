'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { IconUpload, IconLoader2, IconFileText, IconSquareRoundedX, IconSparkles, IconBrain, IconWaveSquare } from '@tabler/icons-react'
import { MultiStepLoader } from '@/components/ui/multi-step-loader'
import AudioUpload from '@/components/ui/audio-upload'

export default function UploadPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [transcript, setTranscript] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [transcriptMetadata, setTranscriptMetadata] = useState(null)

  // VerbIQ-specific loading states for the multi-step loader
  const loadingStates = [
    {
      text: "🔍 Processing your meeting transcript...",
    },
    {
      text: "🧠 Analyzing conversation patterns...",
    },
    {
      text: "👥 Identifying speakers and contributions...",
    },
    {
      text: "💡 Extracting key insights and decisions...",
    },
    {
      text: "🎯 Finding action items and responsibilities...",
    },
    {
      text: "📊 Calculating meeting effectiveness metrics...",
    },
    {
      text: "😊 Analyzing sentiment and engagement levels...",
    },
    {
      text: "🚀 Generating AI recommendations...",
    },
    {
      text: "✨ Finalizing your comprehensive analysis...",
    },
  ]

  console.log('🎯 [UPLOAD PAGE] Component mounted/rendered')

  const handleAnalyze = async () => {
    console.log('🔥 [UPLOAD] handleAnalyze clicked, transcript length:', transcript.length)

    if (!transcript.trim()) {
      console.log('❌ [UPLOAD] No transcript provided')
      setError('Please enter a transcript to analyze')
      return
    }

    console.log('📡 [UPLOAD] Starting analysis request...')
    setIsAnalyzing(true)
    setError('')

    try {
      console.log('🚀 [UPLOAD] Making API request to /api/analyze')
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ transcript }),
      })

      console.log('📨 [UPLOAD] Response received:', response.status, response.statusText)

      const data = await response.json()
      console.log('📊 [UPLOAD] Response data:', data)

      if (!response.ok) {
        console.log('❌ [UPLOAD] Request failed:', data.error || 'Analysis failed')
        throw new Error(data.error || 'Analysis failed')
      }

      console.log('✅ [UPLOAD] Analysis successful!')
      console.log('🆔 [UPLOAD] Analysis ID:', data.analysisId)

      // Trigger user stats and analyses refresh for real-time updates
      console.log('🔄 [UPLOAD] Triggering UI refresh events')
      window.dispatchEvent(new Event('refreshUserStats'))
      window.dispatchEvent(new Event('refreshAnalyses'))

      console.log('🔀 [UPLOAD] Redirecting to analysis view')
      router.push(`/dashboard/analyses/${data.analysisId}`)

    } catch (error) {
      console.error('💥 [UPLOAD] Error during analysis:', error)
      setError(error.message)
    } finally {
      console.log('🏁 [UPLOAD] Analysis request completed')
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTranscript(e.target.result)
        setTranscriptMetadata({ source: 'text', filename: file.name })
      }
      reader.readAsText(file)
    } else {
      setError('Please upload a .txt file')
    }
  }

  const handleAudioTranscript = (transcriptText, metadata = {}) => {
    setTranscript(transcriptText)
    setTranscriptMetadata(metadata)
    setError('')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">New Analysis</h1>
        <p className="text-zinc-400">
          Upload audio, import text file, or paste your meeting transcript to get started
        </p>
      </div>

      <div className="space-y-6">
        <AudioUpload
          onTranscriptReceived={handleAudioTranscript}
          disabled={isAnalyzing}
        />

        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4 text-zinc-500">
            <div className="h-px w-20 bg-zinc-700"></div>
            <span className="text-sm font-medium">OR</span>
            <div className="h-px w-20 bg-zinc-700"></div>
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <IconFileText className="h-5 w-5 text-green-600" />
              Transcript Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-upload" className="text-zinc-300 mb-2 block">
                Upload Text File (Optional)
              </Label>
              <input
                id="file-upload"
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-600 file:text-black hover:file:bg-green-700"
              />
            </div>

            <div>
              <Label htmlFor="transcript" className="text-zinc-300 mb-2 block">
                Meeting Transcript
              </Label>
              <Textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your meeting transcript here...

Speaker 1: Good morning everyone, thank you for joining today's meeting...
Speaker 2: Thanks for having me. I wanted to discuss our quarterly results..."
                className="min-h-[300px] bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/50 border border-red-700 rounded-md">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="text-sm text-zinc-400">
                {transcript.length} characters
                {transcriptMetadata && (
                  <span className="ml-2 text-green-400">
                    • {transcriptMetadata.source === 'audio' ? '🎤' : '📄'} {transcriptMetadata.filename}
                    {transcriptMetadata.language && ` • ${transcriptMetadata.language}`}
                    {transcriptMetadata.confidence && ` • ${Math.round(transcriptMetadata.confidence * 100)}% confidence`}
                  </span>
                )}
              </div>
              <Button
                onClick={() => {
                  console.log('🖱️ [UPLOAD] Button clicked! Transcript exists:', !!transcript.trim())
                  console.log('🔒 [UPLOAD] Button disabled?', isAnalyzing || !transcript.trim())
                  handleAnalyze()
                }}
                disabled={isAnalyzing || !transcript.trim()}
                className="bg-green-600 hover:bg-green-700 text-black font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <IconUpload className="mr-2 h-4 w-4" />
                    Analyze Transcript
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-step loader for analysis process */}
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={isAnalyzing}
        duration={2000}
      />

      {/* Optional: Cancel button when analyzing */}
      {isAnalyzing && (
        <button
          className="fixed top-4 right-4 text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg p-2 z-[120] transition-colors"
          onClick={() => {
            setIsAnalyzing(false)
            setError('Analysis cancelled by user')
          }}
          title="Cancel Analysis"
        >
          <IconSquareRoundedX className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}