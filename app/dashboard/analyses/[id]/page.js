'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IconDownload, IconArrowLeft, IconBrain, IconCircleCheck, IconAlertTriangle, IconUsers, IconTrendingUp, IconTarget, IconBulb, IconChartBar, IconRocket, IconShield, IconStar } from '@tabler/icons-react'
import dynamic from 'next/dynamic'

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

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
    try {
      const response = await fetch(`/api/analyses/${id}`, {
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analysis')
      }

      setAnalysis(data.analysis)
    } catch (err) {
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-600'
      case 'medium': return 'bg-yellow-600'
      case 'low': return 'bg-green-600'
      default: return 'bg-zinc-600'
    }
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-orange-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-zinc-500'
    }
  }

  // Chart configurations
  const getSpeakersChartData = () => {
    if (!analysisData.speakers) return null
    return {
      options: {
        chart: { type: 'donut', background: 'transparent' },
        theme: { mode: 'dark' },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
        labels: analysisData.speakers.map(s => s.name),
        legend: { position: 'bottom', labels: { colors: ['#fff'] } },
        plotOptions: {
          pie: {
            donut: {
              size: '70%',
              labels: {
                show: true,
                name: { show: true, color: '#fff' },
                value: { show: true, color: '#fff', formatter: (val) => val + '%' },
                total: {
                  show: true,
                  color: '#fff',
                  label: 'Total Talk Time',
                  formatter: () => '100%'
                }
              }
            }
          }
        }
      },
      series: analysisData.speakers.map(s => parseInt(s.talkTime) || 0)
    }
  }

  const getSentimentTimelineData = () => {
    if (!analysisData.sentiment?.timeline) return null
    return {
      options: {
        chart: { type: 'area', background: 'transparent', toolbar: { show: false } },
        theme: { mode: 'dark' },
        colors: ['#22c55e'],
        stroke: { curve: 'smooth', width: 2 },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3
          }
        },
        xaxis: {
          categories: analysisData.sentiment.timeline.map(t => t.time),
          labels: { style: { colors: '#9ca3af' } }
        },
        yaxis: {
          min: 0,
          max: 1,
          labels: { style: { colors: '#9ca3af' } }
        },
        grid: { borderColor: '#374151' },
        dataLabels: { enabled: false }
      },
      series: [{
        name: 'Sentiment Score',
        data: analysisData.sentiment.timeline.map(t => t.score)
      }]
    }
  }

  const getTopicBreakdownData = () => {
    if (!analysisData.topicBreakdown) return null
    return {
      options: {
        chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
        theme: { mode: 'dark' },
        colors: ['#3b82f6'],
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 4
          }
        },
        xaxis: {
          categories: analysisData.topicBreakdown.map(t => t.topic),
          labels: { style: { colors: '#9ca3af' } }
        },
        yaxis: {
          labels: { style: { colors: '#9ca3af' } }
        },
        grid: { borderColor: '#374151' },
        dataLabels: {
          enabled: true,
          style: { colors: ['#fff'] },
          formatter: (val) => val + ' min'
        }
      },
      series: [{
        name: 'Time Spent (minutes)',
        data: analysisData.topicBreakdown.map(t => t.timeSpent)
      }]
    }
  }

  const getActionItemsPriorityData = () => {
    if (!analysisData.actionItems) return null
    const priorityCounts = analysisData.actionItems.reduce((acc, item) => {
      acc[item.priority || 'medium'] = (acc[item.priority || 'medium'] || 0) + 1
      return acc
    }, {})
    return {
      options: {
        chart: { type: 'pie', background: 'transparent' },
        theme: { mode: 'dark' },
        colors: ['#ef4444', '#f59e0b', '#22c55e'],
        labels: Object.keys(priorityCounts),
        legend: { position: 'bottom', labels: { colors: ['#fff'] } }
      },
      series: Object.values(priorityCounts)
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
    <div className="min-h-screen bg-black">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {analysis.title}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-zinc-400 text-sm">
                  Created on {new Date(analysis.createdAt).toLocaleDateString()}
                </p>
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                  {analysisData.aiRecommendations?.meetingEffectiveness || 'Analysis Complete'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-xs text-zinc-400">Collaboration Score</p>
              <p className="text-2xl font-bold text-green-400">
                {analysisData.engagementMetrics?.collaborationScore || 'N/A'}
                <span className="text-sm text-zinc-500">/10</span>
              </p>
            </div>
            <Button
              onClick={exportResults}
              variant="outline"
              className="border-zinc-700 text-white hover:bg-zinc-800"
            >
              <IconDownload className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-zinc-900 border-zinc-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600">Overview</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600">Analytics</TabsTrigger>
            <TabsTrigger value="speakers" className="data-[state=active]:bg-green-600">Speakers</TabsTrigger>
            <TabsTrigger value="actions" className="data-[state=active]:bg-green-600">Actions</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-green-600">AI Insights</TabsTrigger>
            <TabsTrigger value="risks" className="data-[state=active]:bg-green-600">Risk & Opportunities</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Summary Card */}
            <Card className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <IconBrain className="h-5 w-5 text-green-600" />
                  Meeting Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 leading-relaxed text-lg">
                  {analysisData.summary}
                </p>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-900/20 to-green-900/5 border-green-800/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-400">Overall Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getSentimentColor(analysisData.sentiment?.overall)}`}></div>
                    <span className="text-2xl font-bold text-white">
                      {(analysisData.sentiment?.score * 100 || 0).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-green-300 mt-2 capitalize">
                    {analysisData.sentiment?.overall || 'neutral'} tone overall
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border-blue-800/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-blue-400">Participants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <IconUsers className="h-5 w-5 text-blue-400" />
                    <span className="text-2xl font-bold text-white">
                      {analysisData.speakers?.length || 0}
                    </span>
                  </div>
                  <p className="text-xs text-blue-300 mt-2">
                    {analysisData.engagementMetrics?.overallEngagement || 'medium'} engagement
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border-purple-800/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-400">Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <IconCircleCheck className="h-5 w-5 text-purple-400" />
                    <span className="text-2xl font-bold text-white">
                      {analysisData.actionItems?.length || 0}
                    </span>
                  </div>
                  <p className="text-xs text-purple-300 mt-2">
                    {analysisData.actionItems?.filter(item => item.priority === 'high').length || 0} high priority
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-900/20 to-orange-900/5 border-orange-800/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-orange-400">Meeting Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <IconTrendingUp className="h-5 w-5 text-orange-400" />
                    <span className="text-2xl font-bold text-white">
                      {analysisData.meetingMetrics?.duration || 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-orange-300 mt-2">
                    {analysisData.meetingMetrics?.participationBalance || 'balanced'} participation
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Key Points & Next Steps */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <IconBulb className="h-5 w-5 text-yellow-500" />
                    Key Discussion Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisData.keyPoints?.slice(0, 5).map((point, index) => (
                      <li key={index} className="flex items-start space-x-3 p-3 bg-zinc-800/50 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-zinc-300 text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <IconRocket className="h-5 w-5 text-blue-500" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisData.nextSteps?.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3 p-3 bg-zinc-800/50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-zinc-300 text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sentiment Timeline Chart */}
              {getSentimentTimelineData() && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <IconTrendingUp className="h-5 w-5 text-green-500" />
                      Sentiment Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Chart
                      options={getSentimentTimelineData().options}
                      series={getSentimentTimelineData().series}
                      type="area"
                      height={300}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Topic Breakdown Chart */}
              {getTopicBreakdownData() && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <IconChartBar className="h-5 w-5 text-blue-500" />
                      Topic Time Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Chart
                      options={getTopicBreakdownData().options}
                      series={getTopicBreakdownData().series}
                      type="bar"
                      height={300}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Meeting Metrics */}
            {analysisData.meetingMetrics && (
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Meeting Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">{analysisData.meetingMetrics.questionToStatementRatio}</p>
                      <p className="text-xs text-zinc-400">Question/Statement Ratio</p>
                    </div>
                    <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-400">{analysisData.meetingMetrics.interruptionCount}</p>
                      <p className="text-xs text-zinc-400">Interruptions</p>
                    </div>
                    <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-400 capitalize">{analysisData.meetingMetrics.agreementLevel}</p>
                      <p className="text-xs text-zinc-400">Agreement Level</p>
                    </div>
                    <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">{analysisData.meetingMetrics.topicCoverage?.length || 0}</p>
                      <p className="text-xs text-zinc-400">Topics Covered</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Speakers Tab */}
          <TabsContent value="speakers" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Talk Time Distribution */}
              {getSpeakersChartData() && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <IconUsers className="h-5 w-5 text-purple-500" />
                      Talk Time Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Chart
                      options={getSpeakersChartData().options}
                      series={getSpeakersChartData().series}
                      type="donut"
                      height={350}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Engagement Metrics */}
              {analysisData.engagementMetrics && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <IconStar className="h-5 w-5 text-yellow-500" />
                      Engagement Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
                      <p className="text-green-400 font-medium">Most Engaged Speaker</p>
                      <p className="text-white text-lg">{analysisData.engagementMetrics.mostEngagedSpeaker}</p>
                    </div>
                    <div className="p-4 bg-orange-900/20 border border-orange-800/30 rounded-lg">
                      <p className="text-orange-400 font-medium">Quiet Participants</p>
                      <p className="text-white">{analysisData.engagementMetrics.quietParticipants?.join(', ') || 'None'}</p>
                    </div>
                    <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                      <p className="text-blue-400 font-medium">Overall Engagement</p>
                      <p className="text-white text-lg capitalize">{analysisData.engagementMetrics.overallEngagement}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Detailed Speaker Analysis */}
            {analysisData.speakers && analysisData.speakers.length > 0 && (
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Detailed Speaker Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {analysisData.speakers.map((speaker, index) => (
                      <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold text-lg">{speaker.name}</h4>
                          <div className="flex items-center space-x-3">
                            <Badge className={`${speaker.engagementLevel === 'high' ? 'bg-green-600' : speaker.engagementLevel === 'low' ? 'bg-red-600' : 'bg-yellow-600'} text-white`}>
                              {speaker.engagementLevel} engagement
                            </Badge>
                            <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                              {speaker.talkTimePercentage || speaker.talkTime}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-zinc-400 text-sm font-medium mb-2">Key Contributions:</p>
                            <ul className="space-y-1">
                              {speaker.keyContributions?.map((contribution, idx) => (
                                <li key={idx} className="text-zinc-300 text-sm flex items-start space-x-2">
                                  <span className="text-green-400 text-xs mt-1">•</span>
                                  <span>{contribution}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-zinc-400 text-sm font-medium mb-2">Topics Discussed:</p>
                            <div className="flex flex-wrap gap-2">
                              {speaker.topics?.map((topic, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Action Items Priority Chart */}
              {getActionItemsPriorityData() && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <IconTarget className="h-5 w-5 text-red-500" />
                      Action Items by Priority
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Chart
                      options={getActionItemsPriorityData().options}
                      series={getActionItemsPriorityData().series}
                      type="pie"
                      height={300}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Key Decisions */}
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <IconTrendingUp className="h-5 w-5 text-blue-500" />
                    Key Decisions Made
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysisData.decisions?.map((decision, index) => (
                    <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-white font-medium">
                          {typeof decision === 'object' ? decision.decision : decision}
                        </p>
                        {typeof decision === 'object' && decision.impact && (
                          <Badge className={`${getImpactColor(decision.impact)} text-white text-xs`}>
                            {decision.impact} impact
                          </Badge>
                        )}
                      </div>
                      {typeof decision === 'object' && decision.category && (
                        <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                          {decision.category}
                        </Badge>
                      )}
                    </div>
                  )) || (
                    <p className="text-zinc-400 text-center py-8">No decisions recorded</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Action Items List */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <IconCircleCheck className="h-5 w-5 text-green-500" />
                  Action Items Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisData.actionItems?.map((item, index) => (
                  <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-white font-medium text-lg">{item.task}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getPriorityColor(item.priority)} text-white text-xs`}>
                          {item.priority || 'medium'} priority
                        </Badge>
                        {item.category && (
                          <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-zinc-400">Assignee: </span>
                        <span className="text-zinc-300">{item.assignee || 'Unassigned'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Deadline: </span>
                        <span className="text-zinc-300">{item.deadline && item.deadline !== 'null' ? item.deadline : 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-zinc-400 text-center py-8">No action items identified</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {analysisData.aiRecommendations && (
              <div className="grid gap-6">
                {/* AI Recommendations Summary */}
                <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-800/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <IconBrain className="h-6 w-6 text-green-400" />
                      AI Analysis & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-green-900/30 rounded-lg border border-green-700/30">
                          <h4 className="text-green-400 font-semibold mb-2">Meeting Effectiveness</h4>
                          <p className="text-2xl font-bold text-white capitalize">{analysisData.aiRecommendations.meetingEffectiveness}</p>
                          <p className="text-green-300 text-sm mt-1">{analysisData.aiRecommendations.communicationInsights}</p>
                        </div>
                        <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-700/30">
                          <h4 className="text-blue-400 font-semibold mb-2">Key Strengths</h4>
                          <ul className="space-y-1">
                            {analysisData.aiRecommendations.strengths?.map((strength, index) => (
                              <li key={index} className="text-blue-300 text-sm flex items-start space-x-2">
                                <span className="text-blue-400 text-xs mt-1">✓</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-orange-900/30 rounded-lg border border-orange-700/30">
                          <h4 className="text-orange-400 font-semibold mb-2">Improvement Areas</h4>
                          <ul className="space-y-1">
                            {analysisData.aiRecommendations.improvementAreas?.map((area, index) => (
                              <li key={index} className="text-orange-300 text-sm flex items-start space-x-2">
                                <span className="text-orange-400 text-xs mt-1">•</span>
                                <span>{area}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-700/30">
                          <h4 className="text-purple-400 font-semibold mb-2">Follow-up Suggestions</h4>
                          <ul className="space-y-1">
                            {analysisData.aiRecommendations.followUpSuggestions?.map((suggestion, index) => (
                              <li key={index} className="text-purple-300 text-sm flex items-start space-x-2">
                                <span className="text-purple-400 text-xs mt-1">→</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Priority */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <IconRocket className="h-5 w-5 text-red-500" />
                      Prioritized Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisData.aiRecommendations.actionPriority?.map((action, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                          <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white text-sm font-bold rounded-full">
                            {index + 1}
                          </div>
                          <span className="text-zinc-300">{action}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Risks & Opportunities Tab */}
          <TabsContent value="risks" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Risks */}
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <IconShield className="h-5 w-5 text-red-500" />
                    Identified Risks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisData.risks?.map((risk, index) => (
                    <div key={index} className="p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-white font-medium">
                          {typeof risk === 'object' ? risk.risk : risk}
                        </p>
                        {typeof risk === 'object' && risk.severity && (
                          <Badge className={`${risk.severity === 'high' ? 'bg-red-600' : risk.severity === 'medium' ? 'bg-orange-600' : 'bg-yellow-600'} text-white text-xs`}>
                            {risk.severity} severity
                          </Badge>
                        )}
                      </div>
                      {typeof risk === 'object' && (
                        <div className="space-y-2">
                          {risk.likelihood && (
                            <p className="text-red-300 text-sm">
                              <span className="text-red-400 font-medium">Likelihood:</span> {risk.likelihood}
                            </p>
                          )}
                          {risk.mitigation && (
                            <p className="text-red-200 text-sm">
                              <span className="text-red-400 font-medium">Mitigation:</span> {risk.mitigation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )) || (
                    <p className="text-zinc-400 text-center py-8">No risks identified</p>
                  )}
                </CardContent>
              </Card>

              {/* Opportunities */}
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <IconBulb className="h-5 w-5 text-yellow-500" />
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisData.opportunities?.map((opportunity, index) => (
                    <div key={index} className="p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-white font-medium">
                          {typeof opportunity === 'object' ? opportunity.opportunity : opportunity}
                        </p>
                        {typeof opportunity === 'object' && opportunity.impact && (
                          <Badge className={`${getImpactColor(opportunity.impact)} text-white text-xs`}>
                            {opportunity.impact} impact
                          </Badge>
                        )}
                      </div>
                      {typeof opportunity === 'object' && (
                        <div className="grid md:grid-cols-2 gap-4 text-sm mt-3">
                          {opportunity.effort && (
                            <p className="text-yellow-300">
                              <span className="text-yellow-400 font-medium">Effort:</span> {opportunity.effort}
                            </p>
                          )}
                          {opportunity.timeline && (
                            <p className="text-yellow-300">
                              <span className="text-yellow-400 font-medium">Timeline:</span> {opportunity.timeline}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )) || (
                    <p className="text-zinc-400 text-center py-8">No opportunities identified</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
