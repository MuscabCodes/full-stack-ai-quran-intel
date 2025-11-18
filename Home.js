import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { quranAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: chapters } = useQuery('chapters', () => 
    quranAPI.getChapters().then(res => res.data.data.chapters)
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      window.location.href = `/quran?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Experience the Quran with AI-Powered Intelligence</h2>
          <p>Deepen your understanding with semantic search, AI explanations, personalized recommendations, and interactive learning tools.</p>
          
          {user && (
            <div className="welcome-banner">
              <p>Welcome back, {user.name}! Continue your journey.</p>
            </div>
          )}
          
          <form onSubmit={handleSearch} className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Ask a question or search by meaning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i> Search
            </button>
          </form>
        </div>
      </section>

      {/* Rest of the home page content */}
      {/* Features, Quran Reader, Tafsir, AI Tutor sections */}
    </div>
  );
};

export default Home;