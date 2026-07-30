import React from 'react';
import { Globe } from 'lucide-react';

const Header = ({ date, title = "하루 일어", onChangeLanguage }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-titles">
          <h1 className="logo">{title}</h1>
          <p className="header-subtitle">행복ICT 임직원을 위한 하루 1분 외국어</p>
        </div>
        {onChangeLanguage && (
          <button className="change-lang-btn" onClick={onChangeLanguage} aria-label="Change Language">
            <Globe size={18} />
          </button>
        )}
      </div>
      <div className="date-badge">{date}</div>
    </header>
  );
};

export default Header;
