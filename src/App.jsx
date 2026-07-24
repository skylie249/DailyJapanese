import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LevelSelector from './components/LevelSelector';
import SentenceCard from './components/SentenceCard';
import WordCard from './components/WordCard';
import SkeletonCard from './components/SkeletonCard';
import { fetchDailyJapanese } from './services/geminiService';

function App() {
  const [date, setDate] = useState('');
  const [level, setLevel] = useState('초급');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set today's date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setDate(formattedDate);
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      if (!date) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await fetchDailyJapanese(date, level);
        setData(result);
      } catch (err) {
        setError(err.message || '데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [date, level]);

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
  };

  return (
    <div className="app-container">
      <Header date={date} />
      
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
            <SentenceCard data={data} />
            <WordCard data={data} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
