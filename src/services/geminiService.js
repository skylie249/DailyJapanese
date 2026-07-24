import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-3.1-flash-lite';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

export const fetchDailyContent = async (language, date, level) => {
  const cacheKey = `daily_lang_${language}_${date}_${level}`;

  // 1. Check Local Storage Cache
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      console.error('Failed to parse cached data', e);
    }
  }

  // 2. Fetch from Gemini API
  if (!API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables.');
  }

  const prompt = `
[역할 및 목적]
당신은 ${language} 원어민 교육 전문가입니다.
사용자가 요청한 날짜(${date})와 난이도(${level})에 맞춰, 오늘 학습할 ${language} 문장 1개와 주요 관련 단어 3~5개를 생성해주세요.

[입력 조건]
- 대상 언어: ${language}
- 대상 날짜: ${date}
- 난이도: ${level}

[난이도 적용 세부 기준]
- 영어: 초급(CEFR A1-A2), 중급(CEFR B1-B2), 고급(CEFR C1-C2)
- 일본어: 초급(JLPT N5-N4), 중급(JLPT N3-N2), 고급(JLPT N1)
- 중국어: 초급(HSK 1-2급), 중급(HSK 3-4급), 고급(HSK 5-6급)
* 선택된 난이도 어휘/문법 기준에 철저히 맞춰 생성하세요.

[필드별 작성 규칙]
1. original_text: 해당 언어의 정식 표기법 준수 (일본어: 한자+가나 혼용 / 중국어: 간체자 / 영어: 원문)
2. reading_hint: 
   - 일본어: 전체 요미가나(히라가나)
   - 중국어: 성조가 포함된 한어병음 (예: Nǐ hǎo)
   - 영어: IPA 발음 기호 (예: /həˈloʊ/)
3. pronunciation: 한국인 학습자를 위한 자연스러운 한글 발음 표기
4. audio_text: TTS(음성합성) 엔진이 읽을 수 있도록 특수기호/괄호/마크다운을 제외한 순수 텍스트
5. words: 문장에 실제 사용되었거나 연관된 핵심 단어 3~5개

[출력 형식 제한]
반드시 아래 지정된 JSON 구조로만 응답하세요.
경고: '' 과 같은 마크다운 코드 블록, 서두/결어 인사말, 부연 설명을 절대로 포함하지 말고 오직 순수 JSON 텍스트만 출력하세요.

{
  "date": "${date}",
  "level": "${level}",
  "language": "${language}",
  "sentence": {
    "original_text": "",
    "reading_hint": "",
    "pronunciation": "",
    "meaning": "",
    "audio_text": ""
  },
  "words": [
    {
      "word": "",
      "reading": "",
      "meaning": "",
      "audio_text": ""
    }
  ]
}
`;

  try {
    const response = await axios.post(
      API_URL,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    let textContent = response.data.candidates[0].content.parts[0].text;
    // Strip markdown backticks just in case the model included them
    textContent = textContent.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(textContent);

    // 3. Save to Local Storage
    localStorage.setItem(cacheKey, JSON.stringify(parsedData));

    return parsedData;
  } catch (error) {
    console.error('Error fetching data from Gemini:', error);
    const errMsg = error.response?.data?.error?.message || error.message || 'Unknown error';
    throw new Error(`Failed to generate daily ${language} content. (${errMsg})`);
  }
};
