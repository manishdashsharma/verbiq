'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  IconFileText,
  IconPlus,
  IconCalendar,
  IconUsers,
  IconEye,
  IconClock
} from '@tabler/icons-react'

export default function Analyses() {
  const { data: session } = useSession()
  const router = useRouter()
  const [analyses, setAnalyses] = useState([])

  useEffect(() => {
    // In a real app, you would fetch analyses from the database
    // For now, we'll show an empty state or mock data
    setAnalyses([])
  }, [])

  const handleNewAnalysis = () => {
    const analysesUsed = session?.user?.analysesUsed || 0
    if (analysesUsed < 5) {
      router.push('/dashboard/new')
    }
  }

  const analysesUsed = session?.user?.analysesUsed || 0
  const canCreateAnalysis = analysesUsed < 5

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Your Analyses</h1>
          <p className="text-zinc-400">
            Manage and review your meeting transcript analyses.
          </p>
        </div>
        {canCreateAnalysis && (
          <Button
            onClick={handleNewAnalysis}
            className="bg-green-600 hover:bg-green-700 text-black font-semibold"
          >
            <IconPlus className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        )}
      </div>

      {/* Usage Stats */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <IconFileText className="h-5 w-5 text-zinc-400" />
                <span className="text-white font-medium">
                  {analysesUsed}/5 analyses used
                </span>
              </div>
              <div className="w-32 bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(analysesUsed / 5) * 100}%` }}
                ></div>
              </div>
            </div>
            {!canCreateAnalysis && (
              <Button
                disabled
                variant="outline"
                className="border-zinc-700 text-zinc-500"
              >
                Upgrade to Pro (Coming Soon)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analyses List */}
      {analyses.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-16">
            <div className="text-center">
              <IconFileText className="h-16 w-16 text-zinc-600 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">No analyses yet</h3>
              <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                Get started by uploading your first meeting transcript or recording.
                Our AI will extract key insights, action items, and decisions for you.
              </p>
              {canCreateAnalysis ? (
                <Button
                  onClick={handleNewAnalysis}
                  className="bg-green-600 hover:bg-green-700 text-black font-semibold"
                >
                  <IconPlus className="mr-2 h-4 w-4" />
                  Create Your First Analysis
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-zinc-500">
                    You&apos;ve reached your free tier limit of 5 analyses.
                  </p>
                  <Button
                    disabled
                    variant="outline"
                    className="border-zinc-700 text-zinc-500"
                  >
                    Upgrade to Pro (Coming Soon)
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {analysis.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-zinc-400">
                          {analysis.date && (
                            <div className="flex items-center space-x-1">
                              <IconCalendar className="h-4 w-4" />
                              <span>{analysis.date}</span>
                            </div>
                          )}
                          {analysis.participants && (
                            <div className="flex items-center space-x-1">
                              <IconUsers className="h-4 w-4" />
                              <span>{analysis.participants}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <IconClock className="h-4 w-4" />
                            <span>{analysis.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          analysis.status === 'completed'
                            ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                            : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                        }`}>
                          {analysis.status === 'completed' ? 'Completed' : 'Processing'}
                        </span>
                      </div>
                    </div>

                    {analysis.summary && (
                      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                        {analysis.summary}
                      </p>
                    )}

                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/analyses/${analysis.id}`)}
                        className="border-zinc-700 text-white hover:bg-zinc-800"
                      >
                        <IconEye className="mr-2 h-4 w-4" />
                        View Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}