import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LevelSelector from './components/LevelSelector';
import SentenceCard from './components/SentenceCard';
import WordCard from './components/WordCard';
import SkeletonCard from './components/SkeletonCard';
import LanguageSelector from './components/LanguageSelector';
import HistoryPage from './components/HistoryPage';
import FavoritesPage from './components/FavoritesPage';
import LoginModal from './components/LoginModal';
import LandingPage from './components/LandingPage';
import { fetchDailyContent, fetchMasterDailyContent } from './services/geminiService';
import {
  buildFavoriteId,
  addFavorite,
  removeFavorite,
  checkIsFavorite,
} from './services/favoritesService';
import { onAuthStateChange, signOut } from './services/authService';
import { t } from './utils/i18n';

function App() {
  const [date, setDate] = useState('');
  const [showLanding, setShowLanding] = useState(true); // 랜딩 페이지 표시 여부
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'history' | 'favorites'
  const [level, setLevel] = useState('초급');
  // Store full language object: { id, label, code, emoji }
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [baseMeaning, setBaseMeaning] = useState('');
  const [isBaseMeaningLoading, setIsBaseMeaningLoading] = useState(false);

  // 즐겨찾기 상태
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  // 인증 상태
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 인증 상태 구독 (앱 마운트 시)
  useEffect(() => {
    setIsAuthLoading(true);
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      setIsAuthLoading(false);
      // 로그인 완료 시 모달 닫기
      if (authUser) {
        setShowLoginModal(false);
      }
    });
    return unsubscribe;
  }, []);

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
        setError(err.message || t('common.error'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [date, level, selectedLanguage]);

  // 즐겨찾기 여부 확인 (date, language, level, user 변경 시)
  useEffect(() => {
    const checkFav = async () => {
      if (!date || !selectedLanguage) return;
      if (!user) {
        setIsFavorite(false);
        return;
      }
      const id = buildFavoriteId(date, selectedLanguage.id, level);
      const result = await checkIsFavorite(id);
      setIsFavorite(result);
    };
    checkFav();
  }, [date, selectedLanguage, level, user]);

  const handleToggleFavorite = useCallback(async () => {
    if (!data || !selectedLanguage) return;
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setIsFavoriteLoading(true);
    try {
      const id = buildFavoriteId(date, selectedLanguage.id, level);
      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
      } else {
        await addFavorite({
          date,
          language: selectedLanguage.id,
          languageCode: selectedLanguage.code,
          level,
          base_meaning: data.base_meaning,
          sentence: data.sentence,
          words: data.words,
        });
        setIsFavorite(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsFavoriteLoading(false);
    }
  }, [data, date, selectedLanguage, level, isFavorite, user]);

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
    setCurrentView(prev => prev === 'history' ? 'home' : 'history');
  };

  const handleToggleFavorites = () => {
    setCurrentView(prev => prev === 'favorites' ? 'home' : 'favorites');
  };

  const handleSelectHistoryDate = (selectedDate) => {
    setDate(selectedDate);
    setBaseMeaning(''); // Clear to re-fetch master data for new date
    setCurrentView('home');
    if (selectedLanguage) {
      setData(null); // Re-trigger loading for new date
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsFavorite(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // 인증 초기화 중이면 빈 화면
  if (isAuthLoading) {
    return <div className="app-container" />;
  }

  // 랜딩 페이지 표시
  if (showLanding) {
    return (
      <div className="app-container">
        <Header
          date={date}
          title={t('app.header.title')}
          user={user}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        <LandingPage onStart={() => setShowLanding(false)} />
        <footer className="app-footer">
          <p>{t('app.footer.slogan')}</p>
        </footer>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  // If no language selected, show language selector
  if (!selectedLanguage) {
    return (
      <div className="app-container">
        <Header
          date={date}
          title={t('app.header.title')}
          onToggleHistory={handleToggleHistory}
          isHistoryView={currentView === 'history'}
          onToggleFavorites={handleToggleFavorites}
          isFavoritesView={currentView === 'favorites'}
          user={user}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onGoHome={() => setShowLanding(true)}
        />
        <div style={{ margin: 'auto 0', display: 'flex', justifyContent: 'center' }}>
          {currentView === 'history' ? (
            <HistoryPage onSelectDate={handleSelectHistoryDate} />
          ) : currentView === 'favorites' ? (
            <FavoritesPage onSelectDate={handleSelectHistoryDate} user={user} onLoginClick={() => setShowLoginModal(true)} />
          ) : (
            <LanguageSelector
              onSelect={handleLanguageSelect}
              baseMeaning={baseMeaning}
              isLoading={isBaseMeaningLoading}
            />
          )}
        </div>
        <footer className="app-footer">
          <p>{t('app.footer.slogan')}</p>
        </footer>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header
        date={date}
        title={t('app.header.daily', { lang: t(selectedLanguage.labelKey) })}
        onChangeLanguage={handleChangeLanguage}
        onToggleHistory={handleToggleHistory}
        isHistoryView={currentView === 'history'}
        onToggleFavorites={handleToggleFavorites}
        isFavoritesView={currentView === 'favorites'}
        user={user}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onGoHome={() => setShowLanding(true)}
      />

      <main className="main-content">
        {currentView === 'history' ? (
          <HistoryPage onSelectDate={handleSelectHistoryDate} />
        ) : currentView === 'favorites' ? (
          <FavoritesPage onSelectDate={handleSelectHistoryDate} user={user} onLoginClick={() => setShowLoginModal(true)} />
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
                <SentenceCard
                  data={data}
                  langCode={selectedLanguage.code}
                  isFavorite={isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  isFavoriteLoading={isFavoriteLoading}
                />
                <WordCard data={data} langCode={selectedLanguage.code} />
              </>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>{t('app.footer.slogan')}</p>
      </footer>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

export default App;
