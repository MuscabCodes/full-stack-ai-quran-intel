const express = require('express');
const { Verse, Chapter } = require('../models/Quran');

const router = express.Router();

// Get all chapters
router.get('/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.find().sort('chapter');
    res.json({
      status: 'success',
      results: chapters.length,
      data: {
        chapters
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get specific chapter
router.get('/chapters/:chapterNumber', async (req, res) => {
  try {
    const chapter = await Chapter.findOne({ chapter: req.params.chapterNumber });
    
    if (!chapter) {
      return res.status(404).json({
        status: 'error',
        message: 'Chapter not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        chapter
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get verses for a chapter
router.get('/chapters/:chapterNumber/verses', async (req, res) => {
  try {
    const verses = await Verse.find({ chapter: req.params.chapterNumber }).sort('verse');
    
    res.json({
      status: 'success',
      results: verses.length,
      data: {
        verses
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Search verses
router.get('/search', async (req, res) => {
  try {
    const { query, language = 'en' } = req.query;
    
    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    // Simple text search - in production, you'd use more advanced search
    const verses = await Verse.find({
      [`translation.${language}`]: { $regex: query, $options: 'i' }
    }).limit(50);

    res.json({
      status: 'success',
      results: verses.length,
      data: {
        verses
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Semantic search (placeholder - integrate with AI service)
router.get('/semantic-search', async (req, res) => {
  try {
    const { query } = req.query;
    
    // This would integrate with an AI service like OpenAI
    // For now, return regular search results
    const verses = await Verse.find({
      $or: [
        { 'translation.en': { $regex: query, $options: 'i' } },
        { 'translation.ur': { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    res.json({
      status: 'success',
      results: verses.length,
      data: {
        verses,
        aiExplanation: "AI-powered semantic search would provide more contextual results here."
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;