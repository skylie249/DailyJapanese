import React from 'react';
import TTSAudioButton from './TTSAudioButton';

const SentenceCard = ({ data }) => {
  if (!data) return null;

  const { sentence, level } = data;

  return (
    <div className="card sentence-card">
      <div className="card-header">
        <span className="level-tag">{level}</span>
        <TTSAudioButton text={sentence.audio_text} />
      </div>
      
      <div className="japanese-text">
        <ruby>
          {sentence.japanese}
          <rt>{sentence.furigana}</rt>
        </ruby>
      </div>
      
      <div className="pronunciation">{sentence.pronunciation}</div>
      <div className="meaning">{sentence.meaning}</div>
    </div>
  );
};

export default SentenceCard;
