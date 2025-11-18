const mongoose = require('mongoose');

const verseSchema = new mongoose.Schema({
  chapter: {
    type: Number,
    required: true
  },
  verse: {
    type: Number,
    required: true
  },
  arabic: {
    type: String,
    required: true
  },
  translation: {
    en: String,
    ur: String,
    fr: String,
    // Add more languages as needed
  },
  transliteration: String,
  audio: {
    url: String,
    duration: Number
  },
  tajweed: {
    rules: [String],
    highlighted: String
  }
});

const chapterSchema = new mongoose.Schema({
  chapter: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    arabic: String,
    transliteration: String,
    english: String
  },
  verses: Number,
  revelation: {
    type: String,
    enum: ['meccan', 'medinan']
  },
  theme: String,
  summary: String
});

module.exports = {
  Verse: mongoose.model('Verse', verseSchema),
  Chapter: mongoose.model('Chapter', chapterSchema)
};