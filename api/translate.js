// api/translate.js
import { generateText } from './_lib/aiClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { text, source = 'ko', target = 'en' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  if (!process.env.GEMINI_API_KEY && !process.env.VITE_GEMINI_API_KEY && !process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Prompt configuration for translation
  const prompt = `Translate the following text from ${source} to ${target}.
Return ONLY the translated text without any explanation, markdown, or quotes.
Text to translate: "${text}"`;

  try {
    const translatedText = (await generateText(prompt, { json: false })).trim();
    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error('Translate error:', error);
    return res.status(500).json({ error: error.message || 'Translation request failed' });
  }
}
