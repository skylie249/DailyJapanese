import React from 'react';

const levels = ['초급', '중급', '고급'];

const LevelSelector = ({ currentLevel, onLevelChange }) => {
  return (
    <div className="level-selector">
      {levels.map((level) => (
        <button
          key={level}
          className={`level-btn ${currentLevel === level ? 'active' : ''}`}
          onClick={() => onLevelChange(level)}
        >
          {level}
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;
