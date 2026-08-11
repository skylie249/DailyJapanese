import React, { useState } from 'react';
import { BookOpen, Star, History, Globe, ChevronRight, Languages, Mic, Bookmark } from 'lucide-react';
import { t } from '../utils/i18n';

const getFeatures = () => [
  {
    icon: <Languages size={22} />,
    title: t('landing.features.f1.title'),
    desc: t('landing.features.f1.desc'),
  },
  {
    icon: <Mic size={22} />,
    title: t('landing.features.f2.title'),
    desc: t('landing.features.f2.desc'),
  },
  {
    icon: <Bookmark size={22} />,
    title: t('landing.features.f3.title'),
    desc: t('landing.features.f3.desc'),
  },
  {
    icon: <History size={22} />,
    title: t('landing.features.f4.title'),
    desc: t('landing.features.f4.desc'),
  },
];

const getHowTo = () => [
  { step: '01', text: t('landing.howto.step1') },
  { step: '02', text: t('landing.howto.step2') },
  { step: '03', text: t('landing.howto.step3') },
  { step: '04', text: t('landing.howto.step4') },
];

const LandingPage = ({ onStart }) => {
  const FEATURES = getFeatures();
  const HOW_TO = getHowTo();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-badge">
          <Globe size={14} />
          {t('landing.hero.badge')}
        </div>
        <h1 className="landing-title">
          {t('landing.hero.title1')}<br />
          <span className="landing-title-accent">{t('landing.hero.title2')}</span>
        </h1>
        <p className="landing-subtitle" style={{ whiteSpace: 'pre-line' }}>
          {t('landing.hero.subtitle')}
        </p>
        <div className="landing-hero-actions">
          <button className="landing-cta-btn" onClick={onStart}>
            <BookOpen size={20} />
            {t('landing.hero.cta')}
            <ChevronRight size={18} className="landing-cta-arrow" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <h2 className="landing-section-title">{t('landing.features.title')}</h2>
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
        <h2 className="landing-section-title">{t('landing.howto.title')}</h2>
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
          {t('landing.bottom.cta')}
        </button>
        <p className="landing-tip">{t('landing.bottom.tip')}</p>
      </div>

    </div>
  );
};

export default LandingPage;
