import React, { useState, useEffect, useRef } from 'react';
import { X, Mic } from 'lucide-react';
import { t } from '../utils/i18n';

export default function VoiceTranslatorModal({ onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Web Speech API 브라우저 크로스 호환성 설정
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setSourceText(text);
        handleTranslate(text);
      };

      recognition.onerror = (event) => {
        console.error('음성 인식 에러:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // iOS Safari 오디오 언락(Unlock) 처리
  const unlockAudio = () => {
    if ('speechSynthesis' in window) {
      const emptyUtterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(emptyUtterance);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(t('translator.error.notsupported'));
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      unlockAudio(); // 사용자의 direct click 시점에 오디오 터치 권한 획득
      setSourceText('');
      setTranslatedText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Vercel Serverless API 연동 번역
  const handleTranslate = async (text) => {
    if (!text) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source: 'Korean', target: 'English' }),
      });

      const data = await res.json();
      if (res.ok) {
        setTranslatedText(data.translatedText);
        speakText(data.translatedText, 'en-US');
      } else {
        setTranslatedText(t('translator.error.failed'));
      }
    } catch (err) {
      console.error(err);
      setTranslatedText(t('translator.error.server'));
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <button className="login-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <h2 className="login-title" style={{ marginBottom: '24px' }}>{t('translator.title')}</h2>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={toggleListening}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              fontSize: '28px',
              border: 'none',
              backgroundColor: isListening ? '#ff4d4f' : 'var(--point-color)',
              color: 'white',
              boxShadow: isListening ? '0 0 12px rgba(255, 77, 79, 0.5)' : '0 4px 12px rgba(255, 107, 80, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              transition: 'all 0.2s'
            }}
          >
            <Mic size={32} />
          </button>
          <p style={{ marginTop: '12px', color: '#666', fontSize: '14px', fontWeight: '500' }}>
            {isListening ? t('translator.btn.listening') : t('translator.btn.idle')}
          </p>

          <div style={{ marginTop: '32px', textAlign: 'left', background: '#f8f9fa', padding: '16px', borderRadius: '12px', border: '1px solid #eee' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>{t('translator.source.label')}</div>
            <div style={{ fontSize: '16px', minHeight: '24px', color: '#333' }}>{sourceText || '-'}</div>
          </div>

          <div style={{ marginTop: '16px', textAlign: 'left', background: '#fff0eb', padding: '16px', borderRadius: '12px', border: '1px solid #ffe4db' }}>
            <div style={{ fontSize: '12px', color: 'var(--point-color)', marginBottom: '8px', fontWeight: '600' }}>{t('translator.target.label')}</div>
            <div style={{ fontSize: '16px', minHeight: '24px', color: '#333' }}>
              {isLoading ? t('translator.translating') : translatedText || '-'}
            </div>
            {translatedText && !isLoading && (
              <button
                onClick={() => speakText(translatedText, 'en-US')}
                style={{ 
                  marginTop: '12px', 
                  padding: '6px 12px', 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  background: 'white',
                  border: '1px solid #ffccbe',
                  borderRadius: '6px',
                  color: 'var(--point-color)',
                  fontWeight: '500'
                }}
              >
                {t('translator.replay')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
