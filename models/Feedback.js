import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ['feedback', 'bugReport', 'featureRequest'],
      required: true,
      default: 'feedback'
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: function() {
        return this.type === 'feedback';
      }
    },
    feedbackText: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: function() {
        return this.type !== 'feedback';
      }
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      required: function() {
        return this.type === 'bugReport';
      }
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved', 'rejected'],
      default: 'pending'
    },
    adminResponse: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Feedback ||
  mongoose.model("Feedback", FeedbackSchema);
