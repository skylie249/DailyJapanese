// api/translate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { text, source = 'ko', target = 'en' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Use VITE_GEMINI_API_KEY for local/Vercel compat if GEMINI_API_KEY is not set.
  // In a real Vercel environment, you would set GEMINI_API_KEY in the Vercel dashboard.
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Prompt configuration for translation
  const prompt = `Translate the following text from ${source} to ${target}. 
Return ONLY the translated text without any explanation, markdown, or quotes.
Text to translate: "${text}"`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Low temperature for more deterministic translation
        }
      })
    });

    const data = await response.json();
    
    if (response.ok && data.candidates && data.candidates.length > 0) {
      const translatedText = data.candidates[0].content.parts[0].text.trim();
      return res.status(200).json({ translatedText });
    } else {
      console.error('Gemini API Error Response:', JSON.stringify(data, null, 2));
      return res.status(500).json({ 
        error: data.error?.message || 'Translation failed',
        status: response.status
      });
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Translation request failed', details: error.message });
  }
}
