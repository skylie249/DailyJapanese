import React from 'react';
import { BookOpen, Star, History, Globe, ChevronRight, Languages, Mic, Bookmark } from 'lucide-react';

const FEATURES = [
  {
    icon: <Languages size={22} />,
    title: '다양한 언어 지원',
    desc: '일본어, 영어, 중국어 등 여러 언어의 오늘의 문장과 단어를 학습할 수 있어요.',
  },
  {
    icon: <Mic size={22} />,
    title: '원어민 발음 듣기',
    desc: 'TTS 기술로 원어민 발음을 바로 들으며 정확한 발음을 익힐 수 있어요.',
  },
  {
    icon: <Bookmark size={22} />,
    title: '즐겨찾기 저장',
    desc: '마음에 드는 문장을 즐겨찾기에 저장하고, 나중에 다시 복습할 수 있어요.',
  },
  {
    icon: <History size={22} />,
    title: '학습 히스토리',
    desc: '지난 날짜의 학습 기록을 언제든지 되돌아보며 복습할 수 있어요.',
  },
];

const HOW_TO = [
  { step: '01', text: '언어를 선택하세요' },
  { step: '02', text: '오늘의 문장·단어를 확인하세요' },
  { step: '03', text: '🔊 버튼으로 발음을 들어보세요' },
  { step: '04', text: '⭐ 버튼으로 즐겨찾기에 저장하세요' },
];

const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-badge">
          <Globe size={14} />
          행복ICT 임직원 전용
        </div>
        <h1 className="landing-title">
          하루 1분<br />
          <span className="landing-title-accent">외국어 학습</span>
        </h1>
        <p className="landing-subtitle">
          매일 새로운 문장 하나, 단어 세 개.<br />
          꾸준한 하루 1분이 큰 실력이 됩니다.
        </p>
        <button className="landing-cta-btn" onClick={onStart}>
          <BookOpen size={20} />
          오늘 학습 시작하기
          <ChevronRight size={18} className="landing-cta-arrow" />
        </button>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <h2 className="landing-section-title">주요 기능</h2>
        <div className="landing-feature-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="landing-feature-card">
              <div className="landing-feature-icon">{f.icon}</div>
              <div className="landing-feature-text">
                <p className="landing-feature-title">{f.title}</p>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to use */}
      <section className="landing-howto">
        <h2 className="landing-section-title">이렇게 사용하세요</h2>
        <ol className="landing-steps">
          {HOW_TO.map((item) => (
            <li key={item.step} className="landing-step">
              <span className="landing-step-num">{item.step}</span>
              <span className="landing-step-text">{item.text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Bottom CTA */}
      <div className="landing-bottom-cta">
        <button className="landing-cta-btn landing-cta-btn--secondary" onClick={onStart}>
          <Star size={17} />
          지금 바로 공부하러 가기
        </button>
        <p className="landing-tip">매일 오전 업데이트 · 로그인 없이도 학습 가능</p>
      </div>
    </div>
  );
};

export default LandingPage;
