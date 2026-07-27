const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-3.1-flash-lite';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// 통합 마스터 데이터를 불러오는 내부 함수 (하루 1회 호출)
export const fetchMasterDailyContent = async (date) => {
  const cacheKey = `daily_master_${date}`;

  // 1. Check Local Storage Cache (Next.js의 ISR 캐싱과 동일한 효과)
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      console.error('Failed to parse cached data', e);
    }
  }

  // 2. Fetch from Gemini API (하루 한 번 전체 언어/난이도 데이터 생성)
  if (!API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables.');
  }

  const prompt = `
[역할 및 목적]
당신은 다국어 교육 전문가입니다.
오늘 학습할 단 하나의 핵심 문장(한국어 기준)을 생성하고, 이를 3개 언어(영어, 일본어, 중국어) 및 각 언어별 3가지 난이도(초급, 중급, 고급)에 맞게 번역 및 변환해주세요.

[입력 조건]
- 대상 날짜: ${date}

[난이도 적용 세부 기준]
- 초급: 핵심 의미만 전달하는 짧고 쉬운 문장 및 기초 어휘 (CEFR A1-A2, JLPT N5-N4, HSK 1-2급)
- 중급: 일상적인 표현이 추가된 자연스러운 문장 및 중급 어휘 (CEFR B1-B2, JLPT N3-N2, HSK 3-4급)
- 고급: 관용구나 고급 표현이 포함된 복잡한 문장 및 심화 어휘 (CEFR C1-C2, JLPT N1, HSK 5-6급)

[필드별 작성 규칙]
1. original_text: 해당 언어의 정식 표기법 준수 (일본어: 한자+가나 혼용 / 중국어: 간체자)
2. reading_hint: 
   - 일본어: 전체 요미가나(히라가나)
   - 중국어: 성조가 포함된 한어병음
   - 영어: IPA 발음 기호
3. pronunciation: 한국인 학습자를 위한 자연스러운 한글 발음 표기
4. audio_text: TTS(음성합성)가 읽을 수 있는 순수 텍스트
5. words: 문장에 실제 사용된 핵심 단어 3~5개

[출력 형식 제한]
반드시 아래 지정된 JSON 구조로만 응답하세요. 마크다운 텍스트(\`\`\`json 등)나 부연 설명을 포함하지 마세요.
{
  "date": "${date}",
  "base_meaning": "오늘의 기준 문장 (한국어)",
  "content": {
    "영어": {
      "초급": { "sentence": { "original_text": "", "reading_hint": "", "pronunciation": "", "meaning": "", "audio_text": "" }, "words": [ { "word": "", "reading": "", "meaning": "", "audio_text": "" } ] },
      "중급": { "sentence": { "original_text": "", "reading_hint": "", "pronunciation": "", "meaning": "", "audio_text": "" }, "words": [ { "word": "", "reading": "", "meaning": "", "audio_text": "" } ] },
      "고급": { "sentence": { "original_text": "", "reading_hint": "", "pronunciation": "", "meaning": "", "audio_text": "" }, "words": [ { "word": "", "reading": "", "meaning": "", "audio_text": "" } ] }
    },
    "일본어": {
      "초급": { "sentence": { "original_text": "", "reading_hint": "", "pronunciation": "", "meaning": "", "audio_text": "" }, "words": [ { "word": "", "reading": "", "meaning": "", "audio_text": "" } ] },
      "중급": { "sentence": { "original_text": "", "reading_hint": "", "pronunciation": "", "meaning": "", "audio_text": "" }, "words": [ { "word": "", "reading": "", "meaning": "", "audio_text": "" } ] },
      "고급": { "sentence": { "original_text": "", "reading_hint": "", "pronunciation": "", "meaning": "", "audio_text": "" }, "words": [ { "word": "", "reading": "", "meaning": "", "audio_text": "" } ] }
    },
    "중국어": {
      "초급": { "sentence": { "original_text": "", "reading_hint": "", "pronunciation": "", "meaning": "", "audio_text": "" }, "words": [ { "word": "", "reading": "", "meaning": "", "audio_text": "" } ] },
      "중급": { "sentence": { "original_text": "", "reading_hint": "", "pronunciation": "", "meaning": "", "audio_text": "" }, "words": [ { "word": "", "reading": "", "meaning": "", "audio_text": "" } ] },
      "고급": { "sentence": { "original_text": "", "reading_hint": "", "pronunciation": "", "meaning": "", "audio_text": "" }, "words": [ { "word": "", "reading": "", "meaning": "", "audio_text": "" } ] }
    }
  }
}
`;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      })
      // Vite(SPA) 환경이므로 Next.js의 next: { revalidate: 86400 } 옵션은 사용 불가하지만,
      // LocalStorage 캐싱이 정확히 같은 24시간 캐싱(Date 기준) 역할을 수행합니다.
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || 'Failed to fetch API');
    }

    const responseData = await res.json();
    let textContent = responseData.candidates[0].content.parts[0].text;
    textContent = textContent.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(textContent);

    // 3. Save to Local Storage
    localStorage.setItem(cacheKey, JSON.stringify(parsedData));

    return parsedData;
  } catch (error) {
    console.error('Error fetching master data from Gemini:', error);
    throw new Error(`Failed to generate daily master content. (${error.message})`);
  }
};

export const fetchDailyContent = async (language, date, level) => {
  // 1. 마스터 데이터를 가져옵니다 (오늘자 데이터가 로컬에 있다면 API 호출 생략됨)
  const masterData = await fetchMasterDailyContent(date);

  // 2. 요청한 언어와 난이도에 맞는 데이터를 추출
  const targetContent = masterData.content[language]?.[level];
  
  if (!targetContent) {
    throw new Error(`해당 언어(${language}) 및 난이도(${level})의 데이터를 찾을 수 없습니다.`);
  }

  // 3. 기존 애플리케이션 구조와 호환되도록 포맷팅하여 반환
  return {
    date: masterData.date,
    level: level,
    language: language,
    base_meaning: masterData.base_meaning, // 공통 기준 문장(한국어)
    sentence: targetContent.sentence,
    words: targetContent.words
  };
};
