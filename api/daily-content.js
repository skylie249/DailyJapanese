// api/daily-content.js
import { createClient } from '@supabase/supabase-js';

// 서버 전용 키 (VITE_ 접두사 없음 → 클라이언트 번들에 절대 포함되지 않음)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

const buildPrompt = (date, pastMeanings) => {
  const pastMeaningsText = pastMeanings.length > 0
    ? `\n[주의사항]\n- 다음은 최근에 이미 학습한 명언들입니다. 절대 아래 명언들과 같거나 비슷한 명언을 생성하지 마세요:\n${pastMeanings.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n`
    : '';

  return `
[역할 및 목적]
당신은 다국어 교육 전문가입니다.
오늘 학습할 단 하나의 명언(한국어 기준)을 생성하고, 이를 4개 언어(영어, 일본어, 중국어, 한국어) 및 각 언어별 3가지 난이도(초급, 중급, 고급)에 맞게 번역 및 변환해주세요.
${pastMeaningsText}
[입력 조건]
- 대상 날짜: ${date}

[난이도 적용 세부 기준]
- 초급: 핵심 의미만 전달하는 짧고 쉬운 문장 및 기초 어휘 (CEFR A1-A2, JLPT N5-N4, HSK 1-2급)
- 중급: 일상적인 표현이 추가된 자연스러운 문장 및 중급 어휘 (CEFR B1-B2, JLPT N3-N2, HSK 3-4급)
- 고급: 관용구나 고급 표현이 포함된 복잡한 문장 및 심화 어휘 (CEFR C1-C2, JLPT N1, HSK 5-6급)

[필드별 작성 규칙]
1. original_text: 해당 언어의 정식 표기법 준수 (일본어: 한자+가나 혼용 / 중국어: 간체자 / 한국어: 한글)
2. reading_hint:
   - 일본어: 전체 요미가나(히라가나)
   - 중국어: 성조가 포함된 한어병음
   - 영어: IPA 발음 기호
   - 한국어: 로마자 표기법 (Romaja)
3. pronunciation: 한국인 학습자를 위한 자연스러운 한글 발음 표기 (단, 한국어인 경우 외국인 학습자를 위한 영문 발음 표기)
4. meaning: 해당 문장의 의미. (영어/일본어/중국어는 한국어로 작성, 한국어는 영어로 작성)
5. audio_text: TTS(음성합성)가 읽을 수 있는 순수 텍스트
6. words: 문장에 실제 사용된 핵심 단어 3~5개. (words 안의 meaning 속성도 위 4번 규칙과 동일하게 적용)

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
    },
    "한국어": {
      "초급": { "sentence": { "original_text": "", "reading_hint": "", "pronunciation": "", "meaning": "", "audio_text": "" }, "words": [ { "word": "", "reading": "", "meaning": "", "audio_text": "" } ] },
      "중급": { "sentence": { "original_text": "", "reading_hint": "", "pronunciation": "", "meaning": "", "audio_text": "" }, "words": [ { "word": "", "reading": "", "meaning": "", "audio_text": "" } ] },
      "고급": { "sentence": { "original_text": "", "reading_hint": "", "pronunciation": "", "meaning": "", "audio_text": "" }, "words": [ { "word": "", "reading": "", "meaning": "", "audio_text": "" } ] }
    }
  }
}
`;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'date query parameter is required' });
  }

  if (!serviceRoleKey) {
    return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on the server' });
  }

  // 1. 캐시 확인 (service role이므로 RLS 무시하고 항상 조회 가능)
  try {
    const { data: cachedData, error } = await supabaseAdmin
      .from('daily_content')
      .select('*')
      .eq('date', date)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to fetch from Supabase:', error);
    }

    if (cachedData) {
      return res.status(200).json({
        date: cachedData.date,
        base_meaning: cachedData.base_meaning,
        content: typeof cachedData.content === 'string' ? JSON.parse(cachedData.content) : cachedData.content,
      });
    }
  } catch (e) {
    console.error('Supabase select error:', e);
  }

  // 2. 중복 방지를 위한 과거 명언 조회
  let pastMeanings = [];
  try {
    const { data: pastData, error: pastError } = await supabaseAdmin
      .from('daily_content')
      .select('base_meaning')
      .order('date', { ascending: false })
      .limit(30);

    if (!pastError && pastData) {
      pastMeanings = pastData.map((item) => item.base_meaning).filter(Boolean);
    }
  } catch (e) {
    console.error('Failed to fetch past contents:', e);
  }

  // 3. Gemini API 호출
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
  }

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: buildPrompt(date, pastMeanings) }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch from Gemini API');
    }

    const responseData = await response.json();
    let textContent = responseData.candidates[0].content.parts[0].text;

    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      textContent = jsonMatch[0];
    } else {
      textContent = textContent.replace(/```json/gi, '').replace(/```/g, '').trim();
    }

    const parsedData = JSON.parse(textContent);

    // 4. Supabase에 저장 (service role 키로 RLS 우회)
    const { error: insertError } = await supabaseAdmin
      .from('daily_content')
      .upsert(
        {
          date: parsedData.date,
          base_meaning: parsedData.base_meaning,
          content: parsedData.content,
        },
        { onConflict: 'date' }
      );

    if (insertError) {
      console.error('Failed to insert into Supabase:', JSON.stringify(insertError, null, 2));
    }

    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error fetching master data from Gemini:', error);
    return res.status(500).json({ error: `Failed to generate daily master content. (${error.message})` });
  }
}
