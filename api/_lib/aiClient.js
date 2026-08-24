// api/_lib/aiClient.js
// Gemini 호출이 429(rate limit)로 실패하면 OpenRouter로 폴백한다.

const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

async function callGemini(apiKey, prompt, { json }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        ...(json ? { responseMimeType: 'application/json' } : {}),
        temperature: json ? 0.7 : 0.1,
      },
    }),
  });

  if (response.status === 429) {
    const error = new Error('Gemini API rate limit exceeded (429)');
    error.status = 429;
    throw error;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API error (${response.status})`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function callOpenRouter(apiKey, prompt, { json }) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: json ? 0.7 : 0.1,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `OpenRouter API error (${response.status})`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

/**
 * Gemini로 텍스트를 생성하되, 429(rate limit)를 받으면 OpenRouter로 자동 폴백한다.
 * @param {string} prompt
 * @param {{ json?: boolean }} options - json: true면 JSON 응답 모드로 요청
 * @returns {Promise<string>} 생성된 텍스트
 */
export async function generateText(prompt, { json = false } = {}) {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (geminiKey) {
    try {
      return await callGemini(geminiKey, prompt, { json });
    } catch (error) {
      if (error.status === 429 && openRouterKey) {
        console.warn('Gemini API 429 발생, OpenRouter로 폴백합니다.');
        return await callOpenRouter(openRouterKey, prompt, { json });
      }
      throw error;
    }
  }

  if (openRouterKey) {
    return await callOpenRouter(openRouterKey, prompt, { json });
  }

  throw new Error('GEMINI_API_KEY 또는 OPENROUTER_API_KEY가 설정되어 있지 않습니다.');
}
