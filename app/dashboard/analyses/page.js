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
  IconClock,
  IconCircleCheck,
  IconMoodHappy,
  IconMoodSad,
  IconMoodEmpty,
  IconStar,
  IconTarget
} from '@tabler/icons-react'

export default function Analyses() {
  const { data: session } = useSession()
  const router = useRouter()
  const [analyses, setAnalyses] = useState([])

  useEffect(() => {
    fetchAnalyses()
  }, [])

  // Add event listener to refresh analyses when new one is created
  useEffect(() => {
    const handleRefreshAnalyses = () => {
      console.log('🔄 [ANALYSES] Refreshing analyses list...')
      fetchAnalyses()
    }

    window.addEventListener('refreshAnalyses', handleRefreshAnalyses)
    return () => window.removeEventListener('refreshAnalyses', handleRefreshAnalyses)
  }, [])

  const fetchAnalyses = async () => {
    try {
      console.log('📊 [ANALYSES] Fetching analyses list...')
      const response = await fetch('/api/analyses', {
        credentials: 'include'
      })
      const data = await response.json()

      if (response.ok) {
        console.log('✅ [ANALYSES] Fetched', data.analyses.length, 'analyses')
        console.log('📋 [ANALYSES] Analyses:', data.analyses.map(a => ({
          id: a._id,
          title: a.title,
          created: new Date(a.createdAt).toLocaleString()
        })))
        setAnalyses(data.analyses)
      }
    } catch (error) {
      console.error('Failed to fetch analyses:', error)
    }
  }

  const handleNewAnalysis = () => {
    const analysesUsed = session?.user?.analysesUsed || 0
    if (analysesUsed < 5) {
      router.push('/dashboard/upload')
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
          {analyses.map((analysis) => {
            const getSentimentIcon = (sentiment) => {
              switch (sentiment) {
                case 'positive': return <IconMoodHappy className="h-4 w-4 text-green-400" />
                case 'negative': return <IconMoodSad className="h-4 w-4 text-red-400" />
                default: return <IconMoodEmpty className="h-4 w-4 text-yellow-400" />
              }
            }

            const getSentimentColor = (sentiment) => {
              switch (sentiment) {
                case 'positive': return 'text-green-400'
                case 'negative': return 'text-red-400'
                default: return 'text-yellow-400'
              }
            }

            return (
              <Card key={analysis._id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {analysis.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-zinc-400">
                          <div className="flex items-center space-x-1">
                            <IconCalendar className="h-4 w-4" />
                            <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                          </div>
                          {analysis.quickStats?.duration && analysis.quickStats.duration !== 'Unknown' && (
                            <div className="flex items-center space-x-1">
                              <IconClock className="h-4 w-4" />
                              <span>{analysis.quickStats.duration} min</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {analysis.quickStats?.meetingEffectiveness && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            analysis.quickStats.meetingEffectiveness === 'high'
                              ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                              : analysis.quickStats.meetingEffectiveness === 'medium'
                              ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                              : 'bg-zinc-600/20 text-zinc-400 border border-zinc-600/30'
                          }`}>
                            {analysis.quickStats.meetingEffectiveness} effectiveness
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          analysis.status === 'completed'
                            ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                            : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                        }`}>
                          {analysis.status === 'completed' ? 'Completed' : 'Processing'}
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    {analysis.summary && (
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        {analysis.summary}
                      </p>
                    )}

                    {/* Quick Stats Grid */}
                    {analysis.quickStats && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-zinc-800">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <IconUsers className="h-4 w-4 text-blue-400" />
                            <span className="text-lg font-semibold text-white">
                              {analysis.quickStats.participantCount}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400">Participants</p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <IconCircleCheck className="h-4 w-4 text-purple-400" />
                            <span className="text-lg font-semibold text-white">
                              {analysis.quickStats.actionItemCount}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400">Action Items</p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            {getSentimentIcon(analysis.quickStats.sentiment)}
                            <span className={`text-lg font-semibold ${getSentimentColor(analysis.quickStats.sentiment)}`}>
                              {Math.round((analysis.quickStats.sentimentScore || 0.5) * 100)}%
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 capitalize">{analysis.quickStats.sentiment} tone</p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <IconStar className="h-4 w-4 text-orange-400" />
                            <span className="text-lg font-semibold text-white">
                              {analysis.quickStats.collaborationScore || 'N/A'}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400">Collaboration</p>
                        </div>
                      </div>
                    )}

                    {/* Key Points Preview */}
                    {analysis.quickStats?.keyPointsPreview && analysis.quickStats.keyPointsPreview.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-zinc-300 flex items-center space-x-1">
                          <IconTarget className="h-4 w-4" />
                          <span>Key Highlights</span>
                        </h4>
                        <ul className="space-y-1">
                          {analysis.quickStats.keyPointsPreview.map((point, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm text-zinc-400">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Items Summary */}
                    {analysis.quickStats?.highPriorityActions > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="flex items-center space-x-1 text-red-400">
                          <IconTarget className="h-4 w-4" />
                          <span className="font-medium">{analysis.quickStats.highPriorityActions}</span>
                        </div>
                        <span className="text-zinc-400">high priority action{analysis.quickStats.highPriorityActions !== 1 ? 's' : ''} require attention</span>
                      </div>
                    )}

                    {/* View Button */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-zinc-500">
                        Click to view detailed analysis with charts and insights
                      </div>
                      <Button
                        onClick={() => router.push(`/dashboard/analyses/${analysis._id}`)}
                        className="bg-green-600 hover:bg-green-700 text-black font-medium px-6"
                      >
                        <IconEye className="mr-2 h-4 w-4" />
                        View Analysis
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}