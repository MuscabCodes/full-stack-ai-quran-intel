const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'scholar'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'canceled'],
      default: 'active'
    },
    expiresAt: Date,
    stripeCustomerId: String
  },
  profile: {
    language: {
      type: String,
      default: 'en'
    },
    recitationStyle: String,
    translationPreference: String
  },
  progress: {
    chaptersRead: [{
      chapter: Number,
      lastRead: Date,
      progress: Number
    }],
    versesMemorized: [{
      chapter: Number,
      verse: Number,
      memorizedAt: Date
    }],
    quizScores: [{
      quizId: mongoose.Schema.Types.ObjectId,
      score: Number,
      total: Number,
      completedAt: Date
    }]
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      dailyVerse: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);