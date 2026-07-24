import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-3-flash-preview';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

export const fetchDailyJapanese = async (date, level) => {
  const cacheKey = `daily_jp_${date}_${level}`;
  
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
당신은 일본어 원어민 교육 전문가입니다.
사용자의 날짜(${date})와 난이도(${level}) 조건에 맞춰 오늘의 일본어 문장 1개와 관련 단어 3~5개를 생성해주세요.
난이도 기준: 초급(N5~N4), 중급(N3~N2), 고급(N1).

반드시 아래 JSON 포맷으로만 반환하세요 (마크다운 백틱 없이 순수 JSON만 반환):
{
  "date": "${date}",
  "level": "${level}",
  "sentence": {
    "japanese": "일본어 원문 (화면 표시용, 한자 포함)",
    "furigana": "한자(히라가나) 형태의 루비 문자용 텍스트. 예: 私(わたし)は",
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

    const textContent = response.data.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(textContent);

    // 3. Save to Local Storage
    localStorage.setItem(cacheKey, JSON.stringify(parsedData));

    return parsedData;
  } catch (error) {
    console.error('Error fetching data from Gemini:', error);
    throw new Error('Failed to generate daily Japanese content.');
  }
};
