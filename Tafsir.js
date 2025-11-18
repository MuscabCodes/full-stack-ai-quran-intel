const mongoose = require('mongoose');

const tafsirSchema = new mongoose.Schema({
  chapter: Number,
  verse: Number,
  author: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'en'
  },
  category: {
    type: String,
    enum: ['simplified', 'classical', 'linguistic', 'scientific', 'legal'],
    default: 'simplified'
  },
  aiGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const questionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  context: {
    chapter: Number,
    verse: Number
  },
  answer: String,
  aiResponse: String,
  category: String,
  isAnswered: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = {
  Tafsir: mongoose.model('Tafsir', tafsirSchema),
  Question: mongoose.model('Question', questionSchema)
};