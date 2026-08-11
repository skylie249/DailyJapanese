import React from 'react';
import { t } from '../utils/i18n';

const getLanguages = () => [
  { id: '한국어', labelKey: 'lang.ko', code: 'ko-KR', emoji: '🇰🇷' },
  { id: '영어', labelKey: 'lang.en', code: 'en-US', emoji: '🇺🇸' },
  { id: '중국어', labelKey: 'lang.zh', code: 'zh-CN', emoji: '🇨🇳' },
  { id: '일본어', labelKey: 'lang.ja', code: 'ja-JP', emoji: '🇯🇵' }
];

const LanguageSelector = ({ onSelect, baseMeaning, isLoading }) => {
  const languages = getLanguages();
  
  return (
    <div className="language-selector-container">
      <h2>
        {isLoading ? (
          t('lang.loading')
        ) : baseMeaning ? (
          `"${baseMeaning}"`
        ) : (
          <span style={{ whiteSpace: 'pre-line' }}>{t('lang.select.prompt')}</span>
        )}
      </h2>
      <div className="language-list">
        {languages.map(lang => (
          <button 
            key={lang.id} 
            className="language-btn"
            onClick={() => onSelect(lang)}
          >
            <span className="lang-emoji">{lang.emoji}</span>
            <span className="lang-label">{t(lang.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
