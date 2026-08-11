import React, { useState, useEffect, useCallback } from 'react';
import { Star, ChevronRight, Trash2, LogIn } from 'lucide-react';
import TTSAudioButton from './TTSAudioButton';
import { getFavorites, removeFavorite } from '../services/favoritesService';

const FavoritesPage = ({ onSelectDate, user, onLoginClick }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setIsLoading(false);
    }
  }, [user, loadFavorites]);

  const handleRemove = async (e, id) => {
    e.stopPropagation();
    setRemovingId(id);
    try {
      await removeFavorite(id);
      setFavorites(prev => prev.filter(f => f.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  const handleToggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="favorites-page">
      <h2 className="history-title">
        <Star size={20} className="history-icon" fill="currentColor" />
        즐겨찾기
      </h2>

      {!user ? (
        <div className="fav-login-prompt">
          <Star size={36} className="fav-login-star" />
          <p className="fav-login-msg">즐겨찾기를 사용하려면 로그인이 필요합니다.</p>
          <button className="fav-login-btn" onClick={onLoginClick}>
            <LogIn size={16} />
            로그인하기
          </button>
        </div>
      ) : isLoading ? (
        <div className="history-loading">즐겨찾기를 불러오는 중입니다...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : favorites.length === 0 ? (
        <div className="history-empty">
          <p>저장된 즐겨찾기가 없습니다.</p>
          <p style={{ marginTop: '8px', fontSize: '13px' }}>카드의 ⭐ 버튼을 눌러 저장해보세요!</p>
        </div>
      ) : (
        <ul className="favorites-list">
          {favorites.map((item) => {
            const isExpanded = expandedId === item.id;
            const isRemoving = removingId === item.id;

            return (
              <li
                key={item.id}
                className={`favorite-item ${isExpanded ? 'expanded' : ''}`}
              >
                {/* 헤더 영역 */}
                <div
                  className="favorite-item-header"
                  onClick={() => handleToggleExpand(item.id)}
                >
                  <div className="favorite-item-meta">
                    <div className="favorite-item-badges">
                      <span className="fav-lang-badge">{item.language}</span>
                      <span className="fav-level-badge">{item.level}</span>
                    </div>
                    <span className="history-date">{item.date}</span>
                    <span className="history-meaning">{item.base_meaning}</span>
                  </div>
                  <div className="favorite-item-actions">
                    <button
                      className="fav-remove-btn"
                      onClick={(e) => handleRemove(e, item.id)}
                      disabled={isRemoving}
                      aria-label="즐겨찾기 삭제"
                    >
                      <Trash2 size={15} />
                    </button>
                    <ChevronRight
                      size={18}
                      className={`history-arrow fav-arrow ${isExpanded ? 'rotated' : ''}`}
                    />
                  </div>
                </div>

                {/* 확장 상세 내용 */}
                {isExpanded && item.sentence && (
                  <div className="favorite-detail">
                    <div className="fav-sentence-block">
                      <div className="fav-sentence-row">
                        <div className="japanese-text fav-sentence-text">
                          <ruby>
                            {item.sentence.original_text}
                            {item.sentence.reading_hint && (
                              <rt>{item.sentence.reading_hint}</rt>
                            )}
                          </ruby>
                        </div>
                        <TTSAudioButton
                          text={item.sentence.audio_text || item.sentence.original_text}
                          langCode={item.language_code}
                        />
                      </div>
                      {item.sentence.pronunciation && (
                        <div className="pronunciation fav-pronunciation">
                          {item.sentence.pronunciation}
                        </div>
                      )}
                      <div className="meaning fav-meaning">{item.sentence.meaning}</div>
                    </div>

                    {item.words && item.words.length > 0 && (
                      <div className="fav-words-block">
                        <p className="fav-words-label">오늘의 단어</p>
                        <ul className="word-list">
                          {item.words.map((wordObj, idx) => (
                            <li key={idx} className="word-item">
                              <div className="word-info">
                                <div className="word-jp">
                                  {wordObj.word}
                                  {wordObj.reading && (
                                    <span className="word-reading">({wordObj.reading})</span>
                                  )}
                                </div>
                                <div className="word-kr">{wordObj.meaning}</div>
                              </div>
                              <TTSAudioButton
                                text={wordObj.audio_text || wordObj.word}
                                langCode={item.language_code}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      className="fav-goto-btn"
                      onClick={() => onSelectDate(item.date)}
                    >
                      이 날짜로 이동 →
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;
