import React from 'react';
import { Star } from 'lucide-react';
import TTSAudioButton from './TTSAudioButton';

const SentenceCard = ({ data, langCode, isFavorite, onToggleFavorite, isFavoriteLoading }) => {
  if (!data || !data.sentence) return null;

  const { sentence, level } = data;

  return (
    <div className="card sentence-card">
      <div className="card-header">
        <span className="level-tag">{level}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={onToggleFavorite}
            disabled={isFavoriteLoading}
            aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
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
