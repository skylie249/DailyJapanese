import React, { useState } from 'react';
import { Globe, History, Star, User, LogOut, LogIn, Home, Mic } from 'lucide-react';
import { t } from '../utils/i18n';
import VoiceTranslatorModal from './VoiceTranslatorModal';

const Header = ({
  date,
  title,
  onChangeLanguage,
  onToggleHistory,
  isHistoryView,
  onToggleFavorites,
  isFavoritesView,
  user,
  onLoginClick,
  onLogout,
  onGoHome,
}) => {
  const [showTranslator, setShowTranslator] = useState(false);
  const displayTitle = title || t('app.header.title');

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-titles">
          {onGoHome ? (
            <button className="logo-home-btn" onClick={onGoHome} aria-label="Home" title="Home">
              <Home size={16} className="logo-home-icon" />
              <h1 className="logo">{displayTitle}</h1>
            </button>
          ) : (
            <h1 className="logo">{displayTitle}</h1>
          )}
          <p className="header-subtitle">{t('app.header.subtitle')}</p>
        </div>
        <div className="header-actions">
          {onToggleFavorites && (
            <button
              className={`history-btn ${isFavoritesView ? 'active' : ''}`}
              onClick={onToggleFavorites}
              aria-label="Toggle Favorites"
            >
              <Star size={18} fill={isFavoritesView ? 'currentColor' : 'none'} />
            </button>
          )}
          {onToggleHistory && (
            <button
              className={`history-btn ${isHistoryView ? 'active' : ''}`}
              onClick={onToggleHistory}
              aria-label="Toggle History"
            >
              <History size={18} />
            </button>
          )}
          <button
            className="history-btn"
            onClick={() => setShowTranslator(true)}
            title={t('landing.hero.translator')}
            aria-label={t('landing.hero.translator')}
          >
            <Mic size={18} />
          </button>
          {/* 로그인/로그아웃 버튼 */}
          {user ? (
            <div className="header-user">
              <div className="header-user-info" title={user.email}>
                <User size={14} />
                <span className="header-user-email">{user.email.split('@')[0]}</span>
              </div>
              <button
                className="history-btn logout-btn"
                onClick={onLogout}
                aria-label="로그아웃"
                title="로그아웃"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              className="history-btn login-btn"
              onClick={onLoginClick}
              aria-label="로그인"
              title="로그인"
            >
              <LogIn size={18} />
            </button>
          )}

          {onChangeLanguage && (
            <button className="change-lang-btn" onClick={onChangeLanguage} aria-label="Change Language">
              <Globe size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="date-badge">{date}</div>
      {showTranslator && (
        <VoiceTranslatorModal onClose={() => setShowTranslator(false)} />
      )}
    </header>
  );
};

export default Header;
