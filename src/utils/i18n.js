// src/utils/i18n.js
export const getBrowserLanguage = () => {
  if (typeof window !== 'undefined' && navigator) {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('ko') ? 'ko' : 'en';
  }
  return 'ko';
};

export const uiLang = getBrowserLanguage();

const translations = {
  en: {
    // Landing Page
    'landing.hero.badge': "For everyone's daily life",
    'landing.hero.title1': '1 min daily',
    'landing.hero.title2': 'language learning',
    'landing.hero.subtitle': 'One new sentence, three words a day.\nA steady 1 minute a day makes a big difference.',
    'landing.hero.cta': 'Start learning today',
    'landing.features.title': 'Key Features',
    'landing.features.f1.title': 'Various languages',
    'landing.features.f1.desc': 'Learn sentences and words in Japanese, English, Chinese, and Korean.',
    'landing.features.f2.title': 'Native pronunciation',
    'landing.features.f2.desc': 'Listen to native pronunciations with TTS technology.',
    'landing.features.f3.title': 'Save favorites',
    'landing.features.f3.desc': 'Save your favorite sentences to review them later.',
    'landing.features.f4.title': 'Learning history',
    'landing.features.f4.desc': 'Look back at your past learning records anytime.',
    'landing.howto.title': 'How to use',
    'landing.howto.step1': 'Select a language',
    'landing.howto.step2': "Check today's sentence and words",
    'landing.howto.step3': 'Listen to pronunciation with 🔊',
    'landing.howto.step4': 'Save to favorites with ⭐',
    'landing.bottom.cta': 'Start studying right now',
    'landing.bottom.tip': 'Updated every morning · No login required',

    // Header & App
    'app.header.title': "Today's Language",
    'app.header.subtitle': "Everyone's 1 min daily language",
    'app.footer.slogan': "We support everyone's daily growth 🚀",
    'app.header.daily': 'Daily {lang}',

    // Language Selector
    'lang.loading': "Loading today's sentence...",
    'lang.select.prompt': 'Please select a language\nto learn',
    'lang.ko': 'Korean',
    'lang.en': 'English',
    'lang.ja': 'Japanese',
    'lang.zh': 'Chinese',

    // Level Selector
    'level.beginner': 'Beginner',
    'level.intermediate': 'Intermediate',
    'level.advanced': 'Advanced',

    // Cards
    'card.meaning': 'Meaning',
    'card.words': 'WORDS',
    'card.history': 'HISTORY',
    'card.favorites': 'FAVORITES',

    // History & Favorites
    'history.empty': 'No learning history for this date.',
    'history.select.date': 'Please select a date from history',
    'favorites.empty': 'No favorite sentences saved.',
    'favorites.login.msg': 'Please log in to save favorites.',
    'favorites.login.btn': 'Log In / Sign Up',

    // Login Modal
    'login.title': 'Welcome to HaruBite',
    'login.desc': 'Enter your email to receive a magic link to login/signup.',
    'login.email.label': 'Email Address',
    'login.email.placeholder': 'example@company.com',
    'login.submit': 'Send Magic Link',
    'login.submit.sending': 'Sending...',
    'login.sent.title': 'Magic Link Sent!',
    'login.sent.desc': 'Please check your inbox and click the link to log in.',
    'login.sent.sub': 'You can close this window now.',
    'login.resend': 'Resend Email',
    'login.error.invalid': 'Please enter a valid email address.',

    // Common
    'common.error': 'Failed to load data.',

    // Voice Translator
    'translator.title': 'Voice Translator',
    'translator.btn.listening': 'Listening...',
    'translator.btn.idle': 'Tap and speak',
    'translator.source.label': 'Korean (Voice Recognition)',
    'translator.target.label': 'English Translation',
    'translator.translating': 'Translating...',
    'translator.replay': '🔊 Replay',
    'translator.error.notsupported': 'This browser does not support voice recognition. (Safari or Chrome app recommended)',
    'translator.error.failed': 'Translation failed',
    'translator.error.server': 'Server communication error',
    'landing.hero.translator': 'Voice Translator'
  },
  ko: {
    // Landing Page
    'landing.hero.badge': '모두의 하루를 위한',
    'landing.hero.title1': '하루 1분',
    'landing.hero.title2': '외국어 학습',
    'landing.hero.subtitle': '매일 새로운 문장 하나, 단어 세 개.\n꾸준한 하루 1분이 큰 실력이 됩니다.',
    'landing.hero.cta': '오늘 학습 시작하기',
    'landing.features.title': '주요 기능',
    'landing.features.f1.title': '다양한 언어 지원',
    'landing.features.f1.desc': '일본어, 영어, 중국어, 한국어의 오늘의 문장과 단어를 학습할 수 있어요.',
    'landing.features.f2.title': '원어민 발음 듣기',
    'landing.features.f2.desc': 'TTS 기술로 원어민 발음을 바로 들으며 정확한 발음을 익힐 수 있어요.',
    'landing.features.f3.title': '즐겨찾기 저장',
    'landing.features.f3.desc': '마음에 드는 문장을 즐겨찾기에 저장하고, 나중에 다시 복습할 수 있어요.',
    'landing.features.f4.title': '학습 히스토리',
    'landing.features.f4.desc': '지난 날짜의 학습 기록을 언제든지 되돌아보며 복습할 수 있어요.',
    'landing.howto.title': '이렇게 사용하세요',
    'landing.howto.step1': '언어를 선택하세요',
    'landing.howto.step2': '오늘의 문장·단어를 확인하세요',
    'landing.howto.step3': '🔊 버튼으로 발음을 들어보세요',
    'landing.howto.step4': '⭐ 버튼으로 즐겨찾기에 저장하세요',
    'landing.bottom.cta': '지금 바로 공부하러 가기',
    'landing.bottom.tip': '매일 오전 업데이트 · 로그인 없이도 학습 가능',

    // Header & App
    'app.header.title': '오늘의 외국어',
    'app.header.subtitle': '모두의 하루 1분 외국어',
    'app.footer.slogan': '모두의 매일매일 성장을 응원합니다 🚀',
    'app.header.daily': '하루 {lang}',

    // Language Selector
    'lang.loading': '오늘의 문장을 가져오는 중입니다...',
    'lang.select.prompt': '배우고 싶은 언어를\n선택해 주세요',
    'lang.ko': '한국어',
    'lang.en': '영어',
    'lang.ja': '일본어',
    'lang.zh': '중국어',

    // Level Selector
    'level.beginner': '초급',
    'level.intermediate': '중급',
    'level.advanced': '고급',

    // Cards
    'card.meaning': '뜻',
    'card.words': '단어',
    'card.history': '학습 히스토리',
    'card.favorites': '즐겨찾기',

    // History & Favorites
    'history.empty': '해당 날짜의 학습 기록이 없습니다.',
    'history.select.date': '히스토리에서 날짜를 선택해주세요.',
    'favorites.empty': '저장된 즐겨찾기가 없습니다.',
    'favorites.login.msg': '즐겨찾기를 저장하고 관리하려면 로그인해주세요.',
    'favorites.login.btn': '로그인 / 회원가입',

    // Login Modal
    'login.title': '환영합니다',
    'login.desc': '이메일을 입력하시면 로그인/회원가입 매직 링크를 보내드립니다.',
    'login.email.label': '이메일 주소',
    'login.email.placeholder': 'example@company.com',
    'login.submit': '로그인 링크 받기',
    'login.submit.sending': '전송 중...',
    'login.sent.title': '이메일 발송 완료!',
    'login.sent.desc': '입력하신 이메일의 수신함을 확인하고 로그인 링크를 클릭해주세요.',
    'login.sent.sub': '이 창은 닫으셔도 됩니다.',
    'login.resend': '이메일 다시 보내기',
    'login.error.invalid': '올바른 이메일 주소를 입력해주세요.',

    // Common
    'common.error': '데이터를 불러오는 데 실패했습니다.',

    // Voice Translator
    'translator.title': '음성 번역기',
    'translator.btn.listening': '듣고 있는 중...',
    'translator.btn.idle': '버튼을 누르고 말하세요',
    'translator.source.label': '한국어 (음성 인식)',
    'translator.target.label': '영어 번역',
    'translator.translating': '번역 중...',
    'translator.replay': '🔊 다시 듣기',
    'translator.error.notsupported': '이 브라우저는 음성 인식을 지원하지 않습니다. (Safari 또는 Chrome 앱 권장)',
    'translator.error.failed': '번역 실패',
    'translator.error.server': '서버 통신 오류',
    'landing.hero.translator': '음성 번역기 열기'
  }
};

export const t = (key, params = {}) => {
  let text = translations[uiLang][key] || translations['ko'][key] || key;

  // 파라미터 치환 (예: {lang})
  Object.keys(params).forEach(param => {
    text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
  });

  return text;
};
