import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { quranAPI } from '../api';

const QuranReader = () => {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [translationLang, setTranslationLang] = useState('en');
  
  const { data: chapters } = useQuery('chapters', () => 
    quranAPI.getChapters().then(res => res.data.data.chapters)
  );
  
  const { data: verses } = useQuery(
    ['verses', currentChapter], 
    () => quranAPI.getVerses(currentChapter).then(res => res.data.data.verses),
    { enabled: !!currentChapter }
  );

  const currentVerseData = verses?.find(v => v.verse === currentVerse);

  return (
    <div className="quran-reader">
      <div className="section-title">
        <h2>Interactive Quran Reader</h2>
        <p>Read, listen, and explore the Quran with multiple translations and recitations.</p>
      </div>
      
      <div className="reader-controls">
        <select 
          value={currentChapter} 
          onChange={(e) => setCurrentChapter(parseInt(e.target.value))}
        >
          {chapters?.map(chapter => (
            <option key={chapter.chapter} value={chapter.chapter}>
              {chapter.chapter}. {chapter.name.english}
            </option>
          ))}
        </select>
        
        <select 
          value={translationLang}
          onChange={(e) => setTranslationLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="ur">Urdu</option>
          <option value="fr">French</option>
        </select>
      </div>
      
      <div className="reader-container">
        <div className="arabic-text">
          {currentVerseData?.arabic || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
        </div>
        
        <div className="translation-text">
          <h3>Translation ({translationLang.toUpperCase()})</h3>
          <p>{currentVerseData?.translation?.[translationLang] || 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'}</p>
          
          <div className="reader-controls">
            <button 
              className="btn btn-outline"
              disabled={currentVerse <= 1}
              onClick={() => setCurrentVerse(currentVerse - 1)}
            >
              <i className="fas fa-step-backward"></i> Previous
            </button>
            
            <button 
              className="btn btn-outline"
              disabled={currentVerse >= (verses?.length || 1)}
              onClick={() => setCurrentVerse(currentVerse + 1)}
            >
              <i className="fas fa-step-forward"></i> Next
            </button>
            
            <button className="btn btn-primary">
              <i className="fas fa-bookmark"></i> Bookmark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranReader;