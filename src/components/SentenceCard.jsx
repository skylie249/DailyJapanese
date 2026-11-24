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
        {sentence.reading_hint && (
          <div className="reading-hint">{sentence.reading_hint}</div>
        )}
        <div>{sentence.original_text}</div>
      </div>
      
      {sentence.pronunciation && (
        <div className="pronunciation">{sentence.pronunciation}</div>
      )}
      <div className="meaning">{sentence.meaning}</div>

      {sentence.answer && sentence.answer.original_text && (
        <div className="answer-block">
          <div className="answer-label">
            <span>{t('card.answer')}</span>
            <TTSAudioButton
              text={sentence.answer.audio_text || sentence.answer.original_text}
              langCode={langCode}
            />
          </div>
          <div className="japanese-text answer-text">
            {sentence.answer.reading_hint && (
              <div className="reading-hint">{sentence.answer.reading_hint}</div>
            )}
            <div>{sentence.answer.original_text}</div>
          </div>
          {sentence.answer.pronunciation && (
            <div className="pronunciation">{sentence.answer.pronunciation}</div>
          )}
          <div className="meaning">{sentence.answer.meaning}</div>
        </div>
      )}
    </div>
  );
};

export default SentenceCard;
