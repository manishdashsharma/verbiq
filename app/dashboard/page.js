'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  IconFileText,
  IconClock,
  IconUsers,
  IconPlus,
  IconTrendingUp
} from '@tabler/icons-react'

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    remainingAnalyses: 5,
    totalMeetings: 0
  })
  const [recentAnalyses, setRecentAnalyses] = useState([])

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const statsResponse = await fetch('/api/user/stats', {
        credentials: 'include'
      })
      const statsData = await statsResponse.json()

      if (statsResponse.ok) {
        setStats({
          totalAnalyses: statsData.stats.analysesUsed,
          remainingAnalyses: statsData.stats.remaining,
          totalMeetings: statsData.stats.analysesUsed
        })
      }

      // Fetch recent analyses (limit to 3 for dashboard)
      const analysesResponse = await fetch('/api/analyses?limit=3', {
        credentials: 'include'
      })
      const analysesData = await analysesResponse.json()

      if (analysesResponse.ok) {
        console.log('📊 [DASHBOARD] Fetched', analysesData.analyses.length, 'recent analyses')
        setRecentAnalyses(analysesData.analyses)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Fallback to session data
      const used = session?.user?.analysesUsed || 0
      setStats({
        totalAnalyses: used,
        remainingAnalyses: 5 - used,
        totalMeetings: used
      })
    }
  }

  const handleNewAnalysis = () => {
    if (stats.remainingAnalyses > 0) {
      router.push('/dashboard/upload')
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-zinc-400">
          Ready to analyze your meeting transcripts?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Analyses Used
            </CardTitle>
            <IconFileText className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalAnalyses}/5
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {stats.remainingAnalyses > 0
                ? `${stats.remainingAnalyses} remaining this month`
                : 'Limit reached this month'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Remaining Analyses
            </CardTitle>
            <IconClock className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.remainingAnalyses}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Free tier limit
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Meetings
            </CardTitle>
            <IconUsers className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalMeetings}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Analyzed to date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Card */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleNewAnalysis}
              disabled={stats.remainingAnalyses === 0}
              className="bg-green-600 hover:bg-green-700 text-black font-semibold flex-1"
            >
              <IconPlus className="mr-2 h-4 w-4" />
              {stats.remainingAnalyses > 0 ? 'New Analysis' : 'Limit Reached'}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/analyses')}
              className="border-zinc-700 text-white hover:bg-zinc-800 flex-1"
            >
              <IconFileText className="mr-2 h-4 w-4" />
              View All Analyses
            </Button>
          </div>

          {stats.remainingAnalyses === 0 && (
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <IconTrendingUp className="h-5 w-5 text-yellow-500" />
                <div>
                  <h3 className="text-sm font-medium text-white">Upgrade for More</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    You&apos;ve reached your free tier limit. Upgrade to Pro for unlimited analyses.
                  </p>
                </div>
              </div>
              <Button
                disabled
                variant="outline"
                className="mt-3 border-zinc-700 text-zinc-500"
              >
                Upgrade to Pro (Coming Soon)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Analyses */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAnalyses.length === 0 ? (
            <div className="text-center py-8">
              <IconFileText className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No analyses yet</h3>
              <p className="text-zinc-400 mb-4">
                Start by uploading your first meeting transcript or recording.
              </p>
              <Button
                onClick={handleNewAnalysis}
                disabled={stats.remainingAnalyses === 0}
                className="bg-green-600 hover:bg-green-700 text-black font-semibold"
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Create Your First Analysis
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div key={analysis._id} className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{analysis.title}</h3>
                    <span className="text-xs text-zinc-400">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {analysis.analysis?.summary && (
                    <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                      {analysis.analysis.summary}
                    </p>
                  )}
                  <Button
                    size="sm"
                    onClick={() => router.push(`/dashboard/analyses/${analysis._id}`)}
                    className="bg-green-600 hover:bg-green-700 text-black font-medium"
                  >
                    View Analysis
                  </Button>
                </div>
              ))}
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/analyses')}
                  className="border-zinc-700 text-white hover:bg-zinc-800"
                >
                  View All Analyses
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}