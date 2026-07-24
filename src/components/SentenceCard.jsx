import React from 'react';
import TTSAudioButton from './TTSAudioButton';

const SentenceCard = ({ data, langCode }) => {
  if (!data || !data.sentence) return null;

  const { sentence, level } = data;

  return (
    <div className="card sentence-card">
      <div className="card-header">
        <span className="level-tag">{level}</span>
        <TTSAudioButton text={sentence.audio_text || sentence.original_text} langCode={langCode} />
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
