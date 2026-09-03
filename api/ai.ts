import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, image, modelName = 'gemini-2.5-flash' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API key is not configured on the server. Please add GEMINI_API_KEY to your environment variables.' });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let result;
    if (image) {
      const mimeType = image.match(/data:(.*?);base64,/)[1];
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

      result = await ai.models.generateContent({
        model: modelName,
        contents: [
          prompt,
          {
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
          }
        ]
      });
    } else {
      result = await ai.models.generateContent({
        model: modelName,
        contents: prompt
      });
    }

    return res.status(200).json({ text: result.text });
  } catch (error) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: error.message || 'AI service is temporarily unavailable. Please try again.' });
  }
}
