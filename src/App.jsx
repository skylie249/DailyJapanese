import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LevelSelector from './components/LevelSelector';
import SentenceCard from './components/SentenceCard';
import WordCard from './components/WordCard';
import SkeletonCard from './components/SkeletonCard';
import LanguageSelector from './components/LanguageSelector';
import { fetchDailyContent } from './services/geminiService';

function App() {
  const [date, setDate] = useState('');
  const [level, setLevel] = useState('초급');
  // Store full language object: { id, label, code, emoji }
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set today's date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setDate(formattedDate);

    // Load language from local storage
    const savedLang = localStorage.getItem('daily_app_lang');
    if (savedLang) {
      try {
        setSelectedLanguage(JSON.parse(savedLang));
      } catch(e) {
        console.error('Failed to parse saved language');
      }
    }
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      if (!date || !selectedLanguage) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await fetchDailyContent(selectedLanguage.id, date, level);
        setData(result);
      } catch (err) {
        setError(err.message || '데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [date, level, selectedLanguage]);

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
  };

  const handleLanguageSelect = (langObj) => {
    setSelectedLanguage(langObj);
    localStorage.setItem('daily_app_lang', JSON.stringify(langObj));
    setData(null); // Clear previous data
    setError(null);
  };

  const handleChangeLanguage = () => {
    setSelectedLanguage(null);
    setData(null);
    setError(null);
  };

  // If no language selected, show language selector
  if (!selectedLanguage) {
    return (
      <div className="app-container center-content">
        <LanguageSelector onSelect={handleLanguageSelect} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header 
        date={date} 
        title={`하루 ${selectedLanguage.label}`} 
        onChangeLanguage={handleChangeLanguage} 
      />
      
      <main className="main-content">
        <LevelSelector currentLevel={level} onLevelChange={handleLevelChange} />
        
        {error && <div className="error-message">{error}</div>}
        
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <SentenceCard data={data} langCode={selectedLanguage.code} />
            <WordCard data={data} langCode={selectedLanguage.code} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
