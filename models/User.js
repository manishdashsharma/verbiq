import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  analysesUsed: {
    type: Number,
    default: 0,
  },
  analysesLimit: {
    type: Number,
    default: 5,
  },
  providers: [{
    type: String, // 'google', 'github'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)