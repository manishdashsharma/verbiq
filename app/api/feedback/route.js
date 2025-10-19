import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { type, feedbackText, stars, title, priority } = await request.json();

    if (!feedbackText || !type || !['feedback', 'bugReport', 'featureRequest'].includes(type)) {
      return NextResponse.json({ error: 'Invalid feedback data' }, { status: 400 });
    }

    if (type === 'feedback') {
      if (typeof stars !== 'number' || stars < 1 || stars > 5) {
        return NextResponse.json({ error: 'Stars rating is required for feedback (1-5)' }, { status: 400 });
      }
    }

    if (type === 'bugReport' || type === 'featureRequest') {
      if (!title || title.trim().length === 0) {
        return NextResponse.json({ error: 'Title is required for bug reports and feature requests' }, { status: 400 });
      }
    }

    if (type === 'bugReport' && priority && !['low', 'medium', 'high', 'critical'].includes(priority)) {
      return NextResponse.json({ error: 'Invalid priority level' }, { status: 400 });
    }

    await connectDB();
    
    const feedbackData = {
      userId: session.user.id,
      type,
      feedbackText,
    };

    if (type === 'feedback') {
      feedbackData.stars = stars;
    }

    if (type === 'bugReport' || type === 'featureRequest') {
      feedbackData.title = title;
    }

    if (type === 'bugReport' && priority) {
      feedbackData.priority = priority;
    }

    const newFeedback = await Feedback.create(feedbackData);

    if (!newFeedback) {
      return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
    }

    return NextResponse.json({ 
        success: true,
        message: 'Feedback submitted successfully' }, { status: 200 });

  } catch (error) {

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json({
        error: 'Unable to connect to feedback service'
      }, { status: 503 });
    }

    return NextResponse.json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    
    await connectDB();

    const feedbacks = await Feedback.find({ isPublished: true}).sort({ createdAt: -1 }).populate('userId', 'name email');

    return NextResponse.json({ 
        success: true,
        message: 'Feedbacks fetched successfully',
        feedbacks }, { status: 200 });

  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json({
        error: 'Unable to connect to feedback service'
      }, { status: 503 });
    }

    return NextResponse.json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}