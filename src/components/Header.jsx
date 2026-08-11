import React from 'react';
import { Globe, History } from 'lucide-react';

const Header = ({ date, title = "하루 일어", onChangeLanguage, onToggleHistory, isHistoryView }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-titles">
          <h1 className="logo">{title}</h1>
          <p className="header-subtitle">행복ICT 임직원을 위한 하루 1분 외국어</p>
        </div>
        <div className="header-actions">
          {onChangeLanguage && (
            <button className="change-lang-btn" onClick={onChangeLanguage} aria-label="Change Language">
              <Globe size={18} />
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
        </div>
      </div>
      <div className="date-badge">{date}</div>
    </header>
  );
};

export default Header;
