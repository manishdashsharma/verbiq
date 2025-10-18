import mongoose from 'mongoose'

const AnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  originalTranscript: {
    type: String,
    required: true,
  },
  analysis: {
    summary: String,
    keyPoints: [String],
    actionItems: [{
      task: String,
      assignee: String,
      deadline: String,
      priority: String,
      category: String
    }],
    decisions: [{
      decision: String,
      impact: String,
      category: String
    }],
    sentiment: {
      overall: String,
      score: Number,
      reasoning: String,
      timeline: [{
        time: String,
        sentiment: String,
        score: Number
      }]
    },
    speakers: [{
      name: String,
      talkTime: mongoose.Schema.Types.Mixed, // Can be string or number
      talkTimePercentage: String,
      keyContributions: [String],
      engagementLevel: String,
      topics: [String]
    }],
    nextSteps: [String],
    risks: [{
      risk: String,
      severity: String,
      likelihood: String,
      mitigation: String
    }],
    opportunities: [{
      opportunity: String,
      impact: String,
      effort: String,
      timeline: String
    }],
    meetingMetrics: {
      duration: String,
      participationBalance: String,
      topicCoverage: [String],
      questionToStatementRatio: Number,
      interruptionCount: Number,
      agreementLevel: String
    },
    aiRecommendations: {
      meetingEffectiveness: String,
      improvementAreas: [String],
      strengths: [String],
      actionPriority: [String],
      followUpSuggestions: [String],
      communicationInsights: String
    },
    topicBreakdown: [{
      topic: String,
      timeSpent: Number,
      importance: String
    }],
    engagementMetrics: {
      overallEngagement: String,
      mostEngagedSpeaker: String,
      quietParticipants: [String],
      collaborationScore: Number
    }
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
})

// Update the updatedAt field before saving
AnalysisSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})


export default mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema)