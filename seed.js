// backend/seed.js
const mongoose = require('mongoose');
const { Verse, Chapter } = require('./models/Quran');

// Sample data for chapters
const chaptersData = [
  {
    chapter: 1,
    name: {
      arabic: "الفاتحة",
      transliteration: "Al-Fatihah",
      english: "The Opening"
    },
    verses: 7,
    revelation: "meccan",
    theme: "Prayer and guidance",
    summary: "The opening chapter of the Quran, essential in daily prayers"
  }
  // Add more chapters...
];

// Sample data for verses
const versesData = [
  {
    chapter: 1,
    verse: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: {
      en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      ur: "شروع کرتا ہوں اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔",
      fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux."
    },
    transliteration: "Bismillāhir-Raḥmānir-Raḥīm"
  }
  // Add more verses...
];

const seedDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/aiquranintel');
    
    // Clear existing data
    await Chapter.deleteMany({});
    await Verse.deleteMany({});
    
    // Insert new data
    await Chapter.insertMany(chaptersData);
    await Verse.insertMany(versesData);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();