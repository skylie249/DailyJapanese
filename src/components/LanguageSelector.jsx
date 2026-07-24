import React from 'react';

const languages = [
  { id: '영어', label: '영어', code: 'en-US', emoji: '🇺🇸' },
  { id: '중국어', label: '중국어', code: 'zh-CN', emoji: '🇨🇳' },
  { id: '일본어', label: '일본어', code: 'ja-JP', emoji: '🇯🇵' }
];

const LanguageSelector = ({ onSelect }) => {
  return (
    <div className="language-selector-container">
      <h2>배우고 싶은 언어를<br/>선택해 주세요</h2>
      <div className="language-list">
        {languages.map(lang => (
          <button 
            key={lang.id} 
            className="language-btn"
            onClick={() => onSelect(lang)}
          >
            <span className="lang-emoji">{lang.emoji}</span>
            <span className="lang-label">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
