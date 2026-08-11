import React from 'react';
import { Star } from 'lucide-react';
import TTSAudioButton from './TTSAudioButton';
import { t } from '../utils/i18n';

const SentenceCard = ({ data, langCode, isFavorite, onToggleFavorite, isFavoriteLoading }) => {
  if (!data || !data.sentence) return null;

  const { sentence, level } = data;
  
  const levelKeys = {
    '초급': 'level.beginner',
    '중급': 'level.intermediate',
    '고급': 'level.advanced'
  };

  return (
    <div className="card sentence-card">
      <div className="card-header">
        <span className="level-tag">{t(levelKeys[level] || level)}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={onToggleFavorite}
            disabled={isFavoriteLoading}
            aria-label="Toggle Favorite"
          >
            <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <TTSAudioButton text={sentence.audio_text || sentence.original_text} langCode={langCode} />
        </div>
      </div>
      
      <div className="japanese-text">
        <ruby>
          {sentence.original_text}
          {sentence.reading_hint && <rt>{sentence.reading_hint}</rt>}
        </ruby>
      </div>
      
      {sentence.pronunciation && (
        <div className="pronunciation">{sentence.pronunciation}</div>
      )}
      <div className="meaning">{sentence.meaning}</div>
    </div>
  );
};

export default SentenceCard;
