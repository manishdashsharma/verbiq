'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  IconArrowLeft,
  IconBug,
  IconBulb,
  IconClock,
  IconLoader,
  IconCheck,
  IconX,
  IconAlertTriangle
} from '@tabler/icons-react'

export default function StatusPage() {
  const [bugs, setBugs] = useState([])
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('bugs')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/feedback')
      if (response.ok) {
        const data = await response.json()
        const bugReports = data.feedbacks.filter(f => f.type === 'bugReport')
        const featureRequests = data.feedbacks.filter(f => f.type === 'featureRequest')
        setBugs(bugReports)
        setFeatures(featureRequests)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <IconClock className="h-4 w-4" />
      case 'in-progress':
        return <IconLoader className="h-4 w-4" />
      case 'resolved':
        return <IconCheck className="h-4 w-4" />
      case 'rejected':
        return <IconX className="h-4 w-4" />
      default:
        return <IconClock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600'
      case 'in-progress':
        return 'bg-blue-600'
      case 'resolved':
        return 'bg-green-600'
      case 'rejected':
        return 'bg-red-600'
      default:
        return 'bg-zinc-600'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <IconAlertTriangle className="h-4 w-4 text-red-500" />
      case 'high':
        return <IconAlertTriangle className="h-4 w-4 text-orange-500" />
      case 'medium':
        return <IconAlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <IconAlertTriangle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusStats = (items) => {
    const stats = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {})
    return stats
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <IconLoader className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-zinc-400">Loading status information...</p>
        </div>
      </div>
    )
  }

  const bugStats = getStatusStats(bugs)
  const featureStats = getStatusStats(features)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-white">VerbIQ</Link>
            </div>
            <nav>
              <Button
                variant="outline"
                className="border-zinc-800 text-white hover:bg-zinc-900"
                asChild
              >
                <Link href="/">
                  <IconArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Development Status</h1>
          <p className="text-zinc-400 text-base sm:text-lg">
            Track the progress of bug fixes and feature requests
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-zinc-900 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('bugs')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'bugs'
                  ? 'bg-red-600 text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <IconBug className="h-4 w-4" />
              Bug Reports ({bugs.length})
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'features'
                  ? 'bg-yellow-600 text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <IconBulb className="h-4 w-4" />
              Feature Requests ({features.length})
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Object.entries(activeTab === 'bugs' ? bugStats : featureStats).map(([status, count]) => (
            <Card key={status} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 text-center">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-black ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
                <div className="text-2xl font-bold text-white mt-2">{count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'bugs' && (
            <>
              {bugs.length === 0 ? (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-8 text-center">
                    <IconBug className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No bug reports yet</h3>
                    <p className="text-zinc-400">All systems running smoothly!</p>
                  </CardContent>
                </Card>
              ) : (
                bugs.map((bug) => (
                  <Card key={bug._id} className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <IconBug className="h-5 w-5 text-red-500" />
                            {bug.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`${getStatusColor(bug.status)} text-black`}>
                              {getStatusIcon(bug.status)}
                              <span className="ml-1">{bug.status}</span>
                            </Badge>
                            {bug.priority && (
                              <Badge variant="outline" className="border-zinc-600 text-zinc-400">
                                {getPriorityIcon(bug.priority)}
                                <span className="ml-1">{bug.priority}</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-zinc-500">
                          {formatDate(bug.createdAt)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        {bug.feedbackText}
                      </p>
                      {bug.adminResponse && (
                        <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
                          <h4 className="text-sm font-medium text-green-400 mb-1">Response:</h4>
                          <p className="text-zinc-300 text-sm">{bug.adminResponse}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}

          {activeTab === 'features' && (
            <>
              {features.length === 0 ? (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-8 text-center">
                    <IconBulb className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No feature requests yet</h3>
                    <p className="text-zinc-400">Be the first to suggest a new feature!</p>
                  </CardContent>
                </Card>
              ) : (
                features.map((feature) => (
                  <Card key={feature._id} className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <IconBulb className="h-5 w-5 text-yellow-500" />
                            {feature.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`${getStatusColor(feature.status)} text-black`}>
                              {getStatusIcon(feature.status)}
                              <span className="ml-1">{feature.status}</span>
                            </Badge>
                          </div>
                        </div>
                        <span className="text-xs text-zinc-500">
                          {formatDate(feature.createdAt)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        {feature.feedbackText}
                      </p>
                      {feature.adminResponse && (
                        <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
                          <h4 className="text-sm font-medium text-green-400 mb-1">Response:</h4>
                          <p className="text-zinc-300 text-sm">{feature.adminResponse}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}