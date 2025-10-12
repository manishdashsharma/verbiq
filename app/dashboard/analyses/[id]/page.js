'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  IconArrowLeft,
  IconDownload,
  IconCalendar,
  IconUsers,
  IconFileText,
  IconBrain,
  IconClipboard,
  IconCheck
} from '@tabler/icons-react'

export default function AnalysisDetail() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('summary')
  const [analysis, setAnalysis] = useState(null)

  useEffect(() => {
    // In a real app, you would fetch the analysis by ID
    // For now, we'll use mock data
    setAnalysis({
      id: params.id,
      title: 'Weekly Team Standup',
      date: '2024-10-12',
      participants: 'John, Sarah, Mike, Lisa',
      status: 'completed',
      createdAt: '2 hours ago',
      summary: 'Team discussed progress on Q4 projects, identified blockers in the mobile app development, and planned upcoming sprints. Key decisions were made regarding the new feature rollout timeline.',
      actionItems: [
        {
          id: 1,
          text: 'Update mobile app architecture document',
          assignee: 'Sarah',
          deadline: '2024-10-15',
          priority: 'high'
        },
        {
          id: 2,
          text: 'Schedule client demo for new features',
          assignee: 'Mike',
          deadline: '2024-10-18',
          priority: 'medium'
        },
        {
          id: 3,
          text: 'Review and approve design mockups',
          assignee: 'Lisa',
          deadline: '2024-10-14',
          priority: 'high'
        }
      ],
      decisions: [
        'Delay mobile app release by 2 weeks to ensure quality',
        'Implement A/B testing for the new dashboard feature',
        'Increase QA team capacity for the next sprint'
      ],
      transcript: `John: Good morning everyone, let's start with our weekly standup.

Sarah: I've been working on the mobile app architecture. We're facing some challenges with the state management system. I think we need to refactor some parts.

Mike: That aligns with what I'm seeing in the backend. The API responses are getting complex. Maybe we should consider breaking them down.

Lisa: From a design perspective, we should also consider how this affects the user experience. I have some mockups ready for review.

John: Great. Sarah, can you update the architecture document with your findings? Mike, let's schedule that client demo we discussed. Lisa, let's review those mockups by Thursday.

Sarah: Absolutely, I'll have that ready by Tuesday.

Mike: I'll reach out to the client today to schedule the demo for next week.

Lisa: Perfect, I'll send the mockups over by end of day Wednesday.

John: Excellent. One more thing - given the complexity we're uncovering, I think we should delay the mobile release by two weeks to ensure quality. Everyone agree?

All: Agreed.

John: Great, that's settled. Let's also implement A/B testing for the dashboard feature, and I'll work on increasing our QA capacity. Meeting adjourned.`
    })
  }, [params.id])

  const tabs = [
    { id: 'summary', label: 'Summary', icon: IconBrain },
    { id: 'actions', label: 'Action Items', icon: IconClipboard },
    { id: 'decisions', label: 'Key Decisions', icon: IconCheck },
    { id: 'transcript', label: 'Full Transcript', icon: IconFileText },
  ]

  const handleExport = (format) => {
    // In a real app, you would implement export functionality
    console.log(`Exporting to ${format}`)
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">Loading analysis...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/analyses')}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to Analyses
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            className="border-zinc-700 text-white hover:bg-zinc-800"
          >
            <IconDownload className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('markdown')}
            className="border-zinc-700 text-white hover:bg-zinc-800"
          >
            <IconDownload className="h-4 w-4 mr-2" />
            Export Markdown
          </Button>
        </div>
      </div>

      {/* Meeting Info */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-white mb-2">{analysis.title}</CardTitle>
              <div className="flex items-center space-x-6 text-sm text-zinc-400">
                {analysis.date && (
                  <div className="flex items-center space-x-2">
                    <IconCalendar className="h-4 w-4" />
                    <span>{analysis.date}</span>
                  </div>
                )}
                {analysis.participants && (
                  <div className="flex items-center space-x-2">
                    <IconUsers className="h-4 w-4" />
                    <span>{analysis.participants}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-400 border border-green-600/30">
                    {analysis.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="border-b border-zinc-800">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'summary' && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Meeting Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 leading-relaxed">{analysis.summary}</p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'actions' && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.actionItems.map((item) => (
                  <div key={item.id} className="border border-zinc-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-white font-medium">{item.text}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.priority === 'high'
                          ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                          : item.priority === 'medium'
                          ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                          : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                      }`}>
                        {item.priority} priority
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-zinc-400">
                      <span>Assigned to: <span className="text-white">{item.assignee}</span></span>
                      <span>Due: <span className="text-white">{item.deadline}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'decisions' && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Key Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.decisions.map((decision, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <IconCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-zinc-300">{decision}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'transcript' && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Full Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-zinc-950 rounded-lg p-4">
                <pre className="text-zinc-300 whitespace-pre-wrap text-sm leading-relaxed">
                  {analysis.transcript}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}