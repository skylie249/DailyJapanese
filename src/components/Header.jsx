import React from 'react';
import { Globe, History, Star, User, LogOut, LogIn, Home } from 'lucide-react';

const Header = ({
  date,
  title = "하루 일어",
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
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-titles">
          {onGoHome ? (
            <button className="logo-home-btn" onClick={onGoHome} aria-label="메인 페이지로 이동" title="메인으로">
              <Home size={16} className="logo-home-icon" />
              <h1 className="logo">{title}</h1>
            </button>
          ) : (
            <h1 className="logo">{title}</h1>
          )}
          <p className="header-subtitle">모두의 하루 1분 외국어</p>
        </div>
        <div className="header-actions">
          {onChangeLanguage && (
            <button className="change-lang-btn" onClick={onChangeLanguage} aria-label="Change Language">
              <Globe size={18} />
            </button>
          )}
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
        </div>
      </div>
      <div className="date-badge">{date}</div>
    </header>
  );
};

export default Header;
