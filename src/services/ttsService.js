export const speak = (text, onStart, onEnd) => {
  if (!('speechSynthesis' in window)) {
    console.error('Web Speech API is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.9; // Slightly slower for learning purposes

  // Event listeners for UI state
  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = (e) => {
    console.error('TTS Error:', e);
    if (onEnd) onEnd();
  };

  // Try to find a Japanese voice
  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(voice => voice.lang.startsWith('ja'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    setVoice();
  } else {
    // Wait for voices to be loaded
    window.speechSynthesis.onvoiceschanged = () => {
      setVoice();
      // Remove listener to prevent memory leaks if called multiple times
      window.speechSynthesis.onvoiceschanged = null;
    };
  }
};

export const stopSpeak = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
