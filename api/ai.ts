import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, image, modelName = 'gemini-2.5-flash', messages, systemInstruction } = req.body;

    if (!prompt && (!messages || !Array.isArray(messages) || messages.length === 0)) {
      return res.status(400).json({ error: 'Prompt or messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API key is not configured on the server. Please add GEMINI_API_KEY to your environment variables.' });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let result;
    if (messages && Array.isArray(messages) && messages.length > 0) {
      // Map multi-turn conversation
      const contents = messages.map(m => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content || m.text || '' }]
      }));

      result = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: systemInstruction ? {
          systemInstruction: systemInstruction
        } : undefined
      });
    } else if (image) {
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
        ],
        config: systemInstruction ? { systemInstruction } : undefined
      });
    } else {
      result = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined
      });
    }

    return res.status(200).json({ text: result.text });
  } catch (error) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: error.message || 'AI service is temporarily unavailable. Please try again.' });
  }
}
