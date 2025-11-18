const express = require('express');
const { Question } = require('../models/Tafsir');
const { protect } = require('./auth');

const router = express.Router();

// Ask AI question
router.post('/ask', protect, async (req, res) => {
  try {
    const { question, context } = req.body;
    
    // In production, this would integrate with an AI service like OpenAI
    // For now, return a simulated response
    const aiResponse = await generateAIResponse(question, context);
    
    // Save question to database
    const savedQuestion = await Question.create({
      user: req.user._id,
      question,
      context,
      aiResponse,
      isAnswered: true
    });

    res.json({
      status: 'success',
      data: {
        question: savedQuestion,
        response: aiResponse
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Generate Tafsir for verse
router.post('/tafsir', protect, async (req, res) => {
  try {
    const { chapter, verse, type = 'simplified' } = req.body;
    
    // Check user subscription for AI features
    if (req.user.subscription.plan === 'free') {
      return res.status(402).json({
        status: 'error',
        message: 'AI Tafsir is a premium feature. Please upgrade your account.'
      });
    }

    const aiTafsir = await generateAITafsir(chapter, verse, type);

    res.json({
      status: 'success',
      data: {
        tafsir: aiTafsir
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Helper functions (simulated AI responses)
async function generateAIResponse(question, context) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = [
    "Based on Islamic teachings and Quranic principles, the answer to your question involves understanding the context and wisdom behind divine guidance.",
    "The Quran addresses this matter through various verses that emphasize patience, gratitude, and trust in Allah's plan.",
    "Islamic scholarship provides multiple perspectives on this topic, with the majority opinion focusing on the balance between rights and responsibilities.",
    "This question relates to fundamental Islamic beliefs about monotheism, prophethood, and the afterlife as detailed in the Quran.",
    "The answer involves examining relevant Quranic verses, Hadith literature, and scholarly interpretations across different schools of thought."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

async function generateAITafsir(chapter, verse, type) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const tafsirs = {
    simplified: `This verse from Surah ${chapter} emphasizes the importance of faith and righteous deeds. It reminds believers of Allah's mercy and the eternal rewards awaiting those who follow the straight path.`,
    classical: `Classical scholars interpret this verse as addressing the fundamental principles of Islamic creed. Ibn Kathir mentions... Al-Tabari explains... The consensus among early scholars is...`,
    linguistic: `Linguistic analysis reveals that the Arabic term used here derives from the root letters which convey meanings of... The grammatical structure indicates...`,
    scientific: `Modern scientific discoveries have revealed remarkable correlations with this verse's description of natural phenomena, demonstrating the Quran's divine origin.`
  };
  
  return tafsirs[type] || tafsirs.simplified;
}

module.exports = router;