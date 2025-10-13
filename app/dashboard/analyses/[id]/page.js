'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IconDownload, IconArrowLeft, IconBrain, IconCircleCheck, IconAlertTriangle, IconUsers, IconTrendingUp } from '@tabler/icons-react'

export default function AnalysisPage() {
  const router = useRouter()
  const params = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (params.id) {
      fetchAnalysis(params.id)
    }
  }, [params.id])

  const fetchAnalysis = async (id) => {
    console.log('🔍 [ANALYSIS PAGE] Fetching analysis:', id)
    try {
      const response = await fetch(`/api/analyses/${id}`, {
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analysis')
      }

      console.log('✅ [ANALYSIS PAGE] Analysis fetched successfully')
      setAnalysis(data.analysis)
    } catch (err) {
      console.error('❌ [ANALYSIS PAGE] Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const exportResults = () => {
    if (!analysis) return

    const exportData = {
      analysis: analysis.analysis,
      exportedAt: new Date().toISOString(),
      generatedBy: 'VerbIQ AI'
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `verbiq-analysis-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-600'
      case 'negative': return 'bg-red-600'
      default: return 'bg-yellow-600'
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-700 rounded w-1/3 mb-4"></div>
          <div className="grid gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-zinc-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-center">
        <IconAlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Error Loading Analysis</h2>
        <p className="text-zinc-400 mb-4">{error}</p>
        <Button
          onClick={() => router.push('/dashboard/analyses')}
          className="bg-green-600 hover:bg-green-700"
        >
          Back to Analyses
        </Button>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-center">
        <p className="text-zinc-400">Analysis not found</p>
        <Button
          onClick={() => router.push('/dashboard/analyses')}
          className="mt-4 bg-green-600 hover:bg-green-700"
        >
          Back to Analyses
        </Button>
      </div>
    )
  }

  const { analysis: analysisData } = analysis

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/analyses')}
            className="border-zinc-700 text-white hover:bg-zinc-800"
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Analyses
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{analysis.title}</h1>
            <p className="text-zinc-400 text-sm">
              Created on {new Date(analysis.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button
          onClick={exportResults}
          variant="outline"
          className="border-zinc-700 text-white hover:bg-zinc-800"
        >
          <IconDownload className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <IconBrain className="h-5 w-5 text-green-600" />
            Meeting Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-300 leading-relaxed">
            {analysisData.summary}
          </p>
        </CardContent>
      </Card>

      {/* Sentiment & Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-400">Overall Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className={`${getSentimentColor(analysisData.sentiment?.overall)} text-white`}>
                {analysisData.sentiment?.overall || 'neutral'}
              </Badge>
              <span className="text-2xl font-bold text-white">
                {(analysisData.sentiment?.score * 100 || 0).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              {analysisData.sentiment?.reasoning}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-400">Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <IconUsers className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold text-white">
                {analysisData.speakers?.length || 0}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              Active participants in meeting
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-400">Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <IconCircleCheck className="h-5 w-5 text-green-400" />
              <span className="text-2xl font-bold text-white">
                {analysisData.actionItems?.length || 0}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              Tasks identified from meeting
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Items and Decisions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <IconCircleCheck className="h-5 w-5 text-green-600" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysisData.actionItems?.map((item, index) => (
              <div key={index} className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                <p className="text-white text-sm font-medium">{item.task}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-zinc-400">
                    Assignee: {item.assignee || 'Unassigned'}
                  </span>
                  {item.deadline && item.deadline !== 'null' && (
                    <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-300">
                      {item.deadline}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <IconTrendingUp className="h-5 w-5 text-blue-600" />
              Key Decisions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysisData.decisions?.map((decision, index) => (
              <div key={index} className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                <p className="text-white text-sm">{decision}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Key Points */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Key Discussion Points</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysisData.keyPoints?.map((point, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-zinc-300 text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Speakers Analysis */}
      {analysisData.speakers && analysisData.speakers.length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <IconUsers className="h-5 w-5 text-purple-600" />
              Speaker Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisData.speakers.map((speaker, index) => (
              <div key={index} className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{speaker.name}</h4>
                  <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                    {speaker.talkTime}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {speaker.keyContributions?.map((contribution, idx) => (
                    <p key={idx} className="text-zinc-400 text-sm">• {contribution}</p>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Next Steps & Risks */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysisData.nextSteps?.map((step, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-zinc-300 text-sm">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Identified Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysisData.risks?.map((risk, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-zinc-300 text-sm">{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities */}
      {analysisData.opportunities && analysisData.opportunities.length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysisData.opportunities.map((opportunity, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-zinc-300 text-sm">{opportunity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
