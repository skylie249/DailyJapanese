import React, { useState, useCallback } from 'react';
import { Mail, X, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { signInWithMagicLink } from '../services/authService';

// 이메일 유효성 검사 정규식
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [sendError, setSendError] = useState('');

  const validateEmail = useCallback((value) => {
    if (!value) {
      return '이메일을 입력해주세요.';
    }
    if (!EMAIL_REGEX.test(value)) {
      return '올바른 이메일 형식이 아닙니다. (예: user@example.com)';
    }
    return '';
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
    } catch (err) {
      setSendError(err.message || '이메일 발송에 실패했습니다. 다시 시도해주세요.');
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
            <h2 className="login-title">이메일을 확인하세요!</h2>
            <p className="login-sent-desc">
              <strong>{email}</strong>로 로그인 링크를 보냈습니다.
            </p>
            <p className="login-sent-sub">
              이메일의 링크를 클릭하면 자동으로 로그인됩니다.
              <br />
              스팸함도 확인해보세요.
            </p>
            <button
              className="login-resend-btn"
              onClick={() => {
                setIsSent(false);
                setSendError('');
              }}
            >
              다른 이메일로 재시도
            </button>
          </div>
        ) : (
          /* 이메일 입력 화면 */
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-icon-wrap">
              <Mail size={32} className="login-mail-icon" />
            </div>
            <h2 className="login-title">로그인</h2>
            <p className="login-desc">
              이메일을 입력하면 로그인 링크를 보내드립니다.
              <br />
              별도의 비밀번호가 필요 없습니다.
            </p>

            <div className="login-field">
              <label className="login-label" htmlFor="login-email">이메일 주소</label>
              <div className={`login-input-wrap ${emailError ? 'has-error' : isEmailValid ? 'is-valid' : ''}`}>
                <input
                  id="login-email"
                  type="email"
                  className="login-input"
                  placeholder="your@email.com"
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
              disabled={!isEmailValid || isSending}
            >
              {isSending ? (
                <span className="login-btn-loading">
                  <span className="login-spinner" />
                  발송 중...
                </span>
              ) : (
                <span className="login-btn-content">
                  로그인 링크 받기
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
