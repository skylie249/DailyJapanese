# 📱 제품 요구사항 정의서 (PRD): 하루 일어 (Daily Japanese)

## 1. 프로젝트 개요 (Overview)
- **제품명:** 하루 일어 (가칭)
- **목표:** 복잡한 로그인이나 설정 없이 매일 1~2분씩 일본어 문장과 단어를 가볍게 학습할 수 있는 모바일 웹앱 제공
- **핵심 특징 (3-Zero):** 
  - **Zero-DB:** 자체 데이터베이스 없이 Gemini AI 실시간 생성
  - **Zero-Auth:** 회원가입/로그인 과정 생략
  - **Zero-Server:** 100% 클라이언트 중심 동작 및 외부 API 연동

---

## 2. 핵심 타겟 및 UX 플로우
- **타겟 유저:** 매일 꾸준히 가볍게 일본어 감각을 유지하고 싶은 모바일 사용자
- **User Flow:**
  1. 웹앱 URL 접속 (초기 화면 진입)
  2. 현재 날짜 자동 확인 및 난이도(초급/중급/고급) 선택
  3. AI를 통해 생성된 '오늘의 문장' 및 '단어' 확인
  4. 오디오 아이콘을 클릭하여 일본어 발음(TTS) 학습

---

## 3. UI / UX 디자인 요구사항
- **컨셉:** 일일 캘린더 카드 형태의 미니멀리즘 디자인 (Single Page)
- **컬러/테마:** 소프트 베이지 배경(#FDFBF7), 다크 그레이 텍스트(#2C2C2C), 포인트 컬러(버밀리언 #FF6B50)
- **화면 구성:**
  - **Header:** 로고(하루 일어) 및 오늘 날짜 표시
  - **Level Selector:** 초급 / 중급 / 고급 탭 버튼 (Segmented Control)
  - **Card 1 (오늘의 문장):** 난이도 태그, 일본어 원문(후리가나 포함), 한글 발음, 한국어 해석, 🔊 오디오 버튼
  - **Card 2 (오늘의 단어):** 단어 리스트(3~5개), 단어별 뜻, 🔊 단어별 오디오 버튼
  - **State UI:** API 로딩 시 Skeleton UI 제공, 오디오 재생 시 아이콘 파동 애니메이션 적용

---

## 4. 시스템 아키텍처 및 기술 스택
- **Front-end:** React 가벼운 SPA 프레임워크
- **AI Content Generator:** https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={GEMINI_API_KEY} (JSON Mode 활성화)
- **TTS (Text-to-Speech):** Web Speech API (`window.speechSynthesis`, 언어: `ja-JP`)
- **Data Caching:** 브라우저 `localStorage` 활용
- **Hosting:** Vercel 정적 웹 호스팅 서비스

---

## 5. Gemini 프롬프트 및 데이터 명세
앱에서 Gemini API 호출 시 전달할 시스템 지침 및 반환 받을 JSON 규격입니다.

### 5.1. 프롬프트 지침 (System Instruction)
- 일본어 원어민 교육 전문가 페르소나 부여
- 사용자의 [날짜]와 [난이도] 조건에 맞춰 생성
- **난이도 기준:** 초급(N5~N4), 중급(N3~N2), 고급(N1)
- 반드시 JSON 포맷으로 반환하며, TTS 읽기 전용 텍스트 필드(`audio_text`)를 별도로 구성할 것

### 5.2. JSON 응답 스키마 (Data Schema)
```json
{
  "date": "YYYY-MM-DD",
  "level": "초급/중급/고급",
  "sentence": {
    "japanese": "일본어 원문 (화면 표시용)",
    "furigana": "한자(히라가나) 형태의 루비 문자용 텍스트",
    "pronunciation": "한글 발음 표기",
    "meaning": "한국어 번역",
    "audio_text": "TTS 재생용 순수 일본어 텍스트"
  },
  "words": [
    {
      "word": "단어",
      "reading": "읽기(히라가나)",
      "meaning": "뜻",
      "audio_text": "TTS 재생용"
    }
  ]
}
```

---

## 6. 데이터 통신 및 캐싱 전략
- **요청 억제:** 불필요한 API 호출을 방지하기 위해 `localStorage`에 `daily_jp_{날짜}_{난이도}` 형태로 데이터를 캐싱합니다.
- **캐시 라이프사이클:** 동일한 날짜/난이도 접속 시 로컬 데이터를 즉시 불러오고, 날짜가 변경되면 새 데이터를 API에 요청합니다.

---

## 7. 향후 확장성 (Post-Launch)
- Vercel Serverless Function을 활용한 API Key 은닉 처리
