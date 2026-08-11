import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Mail, X, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { signInWithMagicLink } from '../services/authService';
import { t } from '../utils/i18n';

// 이메일 유효성 검사 정규식
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [sendError, setSendError] = useState('');
  const [cooldown, setCooldown] = useState(0); // 재발송 쿨다운 (초)
  const cooldownRef = useRef(null);

  const validateEmail = useCallback((value) => {
    if (!value) {
      return t('login.error.invalid');
    }
    if (!EMAIL_REGEX.test(value)) {
      return t('login.error.invalid');
    }
    return '';
  }, []);

  // 쿨다운 타이머
  const startCooldown = useCallback((seconds = 60) => {
    setCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setSendError('');
    // 사용자가 입력을 시작한 후에만 실시간 검사
    if (value.length > 0) {
      setEmailError(validateEmail(value));
    } else {
      setEmailError('');
    }
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const isEmailValid = email.length > 0 && EMAIL_REGEX.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setIsSending(true);
    setSendError('');
    try {
      await signInWithMagicLink(email);
      setIsSent(true);
      startCooldown(60);
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('too many')) {
        setSendError(t('login.error.ratelimit'));
        startCooldown(60);
      } else {
        setSendError(msg || t('common.error'));
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        <button className="login-modal-close" onClick={onClose} aria-label="닫기">
          <X size={18} />
        </button>

        {isSent ? (
          /* 이메일 발송 완료 화면 */
          <div className="login-sent-view">
            <div className="login-sent-icon">
              <CheckCircle size={48} className="sent-check-icon" />
            </div>
            <h2 className="login-title">{t('login.sent.title')}</h2>
            <p className="login-sent-desc">
              <strong>{email}</strong> {t('login.sent.desc')}
            </p>
            <p className="login-sent-sub" style={{ whiteSpace: 'pre-line' }}>
              {t('login.sent.sub')}
            </p>
            <button
              className="login-resend-btn"
              onClick={() => {
                setIsSent(false);
                setSendError('');
              }}
              disabled={cooldown > 0}
            >
              {cooldown > 0
                ? t('login.resend.cooldown').replace('{sec}', cooldown)
                : t('login.resend')}
            </button>
          </div>
        ) : (
          /* 이메일 입력 화면 */
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-icon-wrap">
              <Mail size={32} className="login-mail-icon" />
            </div>
            <h2 className="login-title">{t('login.title')}</h2>
            <p className="login-desc" style={{ whiteSpace: 'pre-line' }}>
              {t('login.desc')}
            </p>

            <div className="login-field">
              <label className="login-label" htmlFor="login-email">{t('login.email.label')}</label>
              <div className={`login-input-wrap ${emailError ? 'has-error' : isEmailValid ? 'is-valid' : ''}`}>
                <input
                  id="login-email"
                  type="email"
                  className="login-input"
                  placeholder={t('login.email.placeholder')}
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  autoFocus
                  autoComplete="email"
                />
              </div>
              {emailError && (
                <div className="login-field-error">
                  <AlertCircle size={13} />
                  {emailError}
                </div>
              )}
            </div>

            {sendError && (
              <div className="login-send-error">
                <AlertCircle size={14} />
                {sendError}
              </div>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={!isEmailValid || isSending || cooldown > 0}
            >
              {isSending ? (
                <span className="login-btn-loading">
                  <span className="login-spinner" />
                  {t('login.submit.sending')}
                </span>
              ) : cooldown > 0 ? (
                <span className="login-btn-content">
                  {t('login.submit.cooldown').replace('{sec}', cooldown)}
                </span>
              ) : (
                <span className="login-btn-content">
                  {t('login.submit')}
                  <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
