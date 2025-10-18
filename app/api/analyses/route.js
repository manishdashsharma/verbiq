import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Analysis from '@/models/Analysis'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 10
    const page = parseInt(searchParams.get('page')) || 1
    const skip = (page - 1) * limit
    const analyses = await Analysis.find({ userId: user._id })
      .select('title createdAt status analysis.summary analysis.sentiment.overall analysis.sentiment.score analysis.speakers analysis.actionItems analysis.meetingMetrics.duration analysis.aiRecommendations.meetingEffectiveness analysis.engagementMetrics.collaborationScore analysis.keyPoints')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Analysis.countDocuments({ userId: user._id })

    const analysisPreview = analyses.map(analysis => {
      const analysisData = analysis.analysis || {}
      return {
        _id: analysis._id,
        title: analysis.title,
        status: analysis.status,
        createdAt: analysis.createdAt,
        summary: analysisData.summary || 'No summary available',
        quickStats: {
          participantCount: analysisData.speakers?.length || 0,
          actionItemCount: analysisData.actionItems?.length || 0,
          highPriorityActions: analysisData.actionItems?.filter(item => item.priority === 'high').length || 0,
          sentiment: analysisData.sentiment?.overall || 'neutral',
          sentimentScore: analysisData.sentiment?.score || 0.5,
          meetingEffectiveness: analysisData.aiRecommendations?.meetingEffectiveness || 'unknown',
          collaborationScore: analysisData.engagementMetrics?.collaborationScore || null,
          duration: analysisData.meetingMetrics?.duration || 'Unknown',
          keyPointsPreview: analysisData.keyPoints?.slice(0, 3) || []
        }
      }
    })

    const response = {
      analyses: analysisPreview,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}