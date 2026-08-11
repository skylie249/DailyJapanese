import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LevelSelector from './components/LevelSelector';
import SentenceCard from './components/SentenceCard';
import WordCard from './components/WordCard';
import SkeletonCard from './components/SkeletonCard';
import LanguageSelector from './components/LanguageSelector';
import HistoryPage from './components/HistoryPage';
import { fetchDailyContent, fetchMasterDailyContent } from './services/geminiService';

function App() {
  const [date, setDate] = useState('');
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'history'
  const [level, setLevel] = useState('초급');
  // Store full language object: { id, label, code, emoji }
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [baseMeaning, setBaseMeaning] = useState('');
  const [isBaseMeaningLoading, setIsBaseMeaningLoading] = useState(false);

  useEffect(() => {
    // Set today's date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setDate(formattedDate);
  }, []);

  useEffect(() => {
    const loadMasterData = async () => {
      if (!date) return;
      setIsBaseMeaningLoading(true);
      try {
        const master = await fetchMasterDailyContent(date);
        setBaseMeaning(master.base_meaning);
      } catch (err) {
        console.error('Failed to load master data for base meaning:', err);
      } finally {
        setIsBaseMeaningLoading(false);
      }
    };
    
    // Only load if we don't have baseMeaning yet
    if (date && !baseMeaning) {
      loadMasterData();
    }
  }, [date, baseMeaning]);

  useEffect(() => {
    const loadContent = async () => {
      if (!date || !selectedLanguage) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await fetchDailyContent(selectedLanguage.id, date, level);
        setData(result);
        if (!baseMeaning && result.base_meaning) {
          setBaseMeaning(result.base_meaning);
        }
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
    setData(null); // Clear previous data
    setError(null);
  };

  const handleChangeLanguage = () => {
    setSelectedLanguage(null);
    setData(null);
    setError(null);
  };

  const handleToggleHistory = () => {
    setCurrentView(prev => prev === 'home' ? 'history' : 'home');
  };

  const handleSelectHistoryDate = (selectedDate) => {
    setDate(selectedDate);
    setCurrentView('home');
    if (selectedLanguage) {
      setData(null); // Re-trigger loading for new date
    }
  };

  // If no language selected, show language selector
  if (!selectedLanguage) {
    return (
      <div className="app-container">
        <Header 
          date={date} 
          title="오늘의 외국어" 
          onToggleHistory={handleToggleHistory}
          isHistoryView={currentView === 'history'}
        />
        <div style={{ margin: 'auto 0', display: 'flex', justifyContent: 'center' }}>
          {currentView === 'history' ? (
            <HistoryPage onSelectDate={handleSelectHistoryDate} />
          ) : (
            <LanguageSelector 
              onSelect={handleLanguageSelect} 
              baseMeaning={baseMeaning} 
              isLoading={isBaseMeaningLoading}
            />
          )}
        </div>
        <footer className="app-footer">
          <p>행복ICT 사우분들의 매일매일 성장을 응원합니다 🚀</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header 
        date={date} 
        title={`하루 ${selectedLanguage.label}`} 
        onChangeLanguage={handleChangeLanguage} 
        onToggleHistory={handleToggleHistory}
        isHistoryView={currentView === 'history'}
      />
      
      <main className="main-content">
        {currentView === 'history' ? (
          <HistoryPage onSelectDate={handleSelectHistoryDate} />
        ) : (
          <>
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
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>행복ICT 사우분들의 매일매일 성장을 응원합니다 🚀</p>
      </footer>
    </div>
  );
}

export default App;
