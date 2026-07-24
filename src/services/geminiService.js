import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-3-flash-preview';
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
당신은 ${language} 원어민 교육 전문가입니다.
사용자의 날짜(${date})와 난이도(${level}) 조건에 맞춰 오늘의 ${language} 문장 1개와 관련 단어 3~5개를 생성해주세요.
난이도 기준: 초급, 중급, 고급.

반드시 아래 JSON 포맷으로만 반환하세요 (마크다운 백틱 없이 순수 JSON만 반환):
{
  "date": "${date}",
  "level": "${level}",
  "language": "${language}",
  "sentence": {
    "original_text": "원문 (예: 일본어라면 한자 포함, 중국어라면 간체자)",
    "reading_hint": "읽기 힌트 (예: 일본어면 후리가나/요미가나, 중국어면 병음, 영어면 발음 기호)",
    "pronunciation": "한글 발음 표기",
    "meaning": "한국어 번역",
    "audio_text": "TTS 재생용 순수 텍스트 (기호 등 제외)"
  },
  "words": [
    {
      "word": "단어",
      "reading": "읽기 힌트 (히라가나/병음/발음기호 등)",
      "meaning": "뜻",
      "audio_text": "TTS 재생용 텍스트"
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
