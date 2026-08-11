import React from 'react';
import { t } from '../utils/i18n';

const levels = [
  { id: '초급', key: 'level.beginner' },
  { id: '중급', key: 'level.intermediate' },
  { id: '고급', key: 'level.advanced' }
];

const LevelSelector = ({ currentLevel, onLevelChange }) => {
  return (
    <div className="level-selector">
      {levels.map((level) => (
        <button
          key={level.id}
          className={`level-btn ${currentLevel === level.id ? 'active' : ''}`}
          onClick={() => onLevelChange(level.id)}
        >
          {t(level.key)}
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;
