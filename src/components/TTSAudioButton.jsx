import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speak, stopSpeak } from '../services/ttsService';

const TTSAudioButton = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (isPlaying) {
      stopSpeak();
      setIsPlaying(false);
    } else {
      speak(
        text,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    }
  };

  return (
    <button
      onClick={handlePlay}
      className={`audio-button ${isPlaying ? 'playing' : ''}`}
      aria-label="Play audio"
    >
      <Volume2 size={20} className="icon" />
      {isPlaying && (
        <span className="ripple"></span>
      )}
    </button>
  );
};

export default TTSAudioButton;
