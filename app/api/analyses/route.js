import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Analysis from '@/models/Analysis'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request) {
  console.log('🔍 [API] /api/analyses - Starting request...')

  try {
    // Check authentication
    console.log('🔐 [API] Checking authentication...')
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      console.log('❌ [API] No session or email found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ [API] Authenticated user:', session.user.email)

    // Connect to database
    console.log('🗄️ [API] Connecting to database...')
    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    console.log('👤 [API] User found:', user ? `ID: ${user._id}, Email: ${user.email}` : 'null')

    if (!user) {
      console.log('❌ [API] User not found in database')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 10
    const page = parseInt(searchParams.get('page')) || 1
    const skip = (page - 1) * limit

    console.log('📊 [API] Query params - limit:', limit, 'page:', page, 'skip:', skip)

    // Fetch user's analyses
    console.log('🔎 [API] Searching for analyses for user ID:', user._id.toString())
    const analyses = await Analysis.find({ userId: user._id })
      .select('title createdAt status analysis.summary')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Analysis.countDocuments({ userId: user._id })

    console.log('📈 [API] Found', analyses.length, 'analyses out of', total, 'total')
    console.log('📋 [API] Analysis IDs:', analyses.map(a => a._id.toString()))

    const response = {
      analyses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }

    console.log('✅ [API] Returning response:', JSON.stringify(response, null, 2))
    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ [API] Fetch analyses error:', error)
    console.error('❌ [API] Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}