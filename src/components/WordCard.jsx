import React from 'react';
import TTSAudioButton from './TTSAudioButton';

const WordCard = ({ data }) => {
  if (!data || !data.words || data.words.length === 0) return null;

  return (
    <div className="card word-card">
      <div className="card-header">
        <span className="level-tag word-tag">오늘의 단어</span>
      </div>
      <ul className="word-list">
        {data.words.map((wordObj, index) => (
          <li key={index} className="word-item">
            <div className="word-info">
              <div className="word-jp">{wordObj.word} <span className="word-reading">({wordObj.reading})</span></div>
              <div className="word-kr">{wordObj.meaning}</div>
            </div>
            <TTSAudioButton text={wordObj.audio_text || wordObj.word} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordCard;
