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
      deadline: String
    }],
    decisions: [String],
    sentiment: {
      overall: String,
      score: Number,
      reasoning: String
    },
    speakers: [{
      name: String,
      talkTime: String,
      keyContributions: [String]
    }],
    nextSteps: [String],
    risks: [String],
    opportunities: [String]
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