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

    const apiKey = process.env.GEMINI_API_KEY || 
                   process.env.GOOGLE_API_KEY || 
                   process.env.GOOGLE_GENAI_API_KEY || 
                   process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not configured in server environment variables.');
      
      // If it's a conversation (girlfriend or chatbot), generate a smooth fallback
      if (messages && Array.isArray(messages) && messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        const userText = (lastMsg?.content || lastMsg?.text || '').trim();
        
        // Check if it's AI Girlfriend based on systemInstruction
        if (systemInstruction && (systemInstruction.includes('girlfriend') || systemInstruction.includes('Lahore') || systemInstruction.includes('Karachi') || systemInstruction.includes('WhatsApp'))) {
          // Handled on client as well, but return realistic response from server
          return res.status(200).json({ 
            text: `Hii! Kese ho aap? Main aapka message dekh kar bohot khush hui 😊❤️ Aur batao aaj ka din kaisa guzra aapka?`,
            warning: 'API key not configured in environment variables. Running in companion mode.'
          });
        }

        return res.status(200).json({
          text: `Hello! I received your message: "${userText}". To enable full real-time Gemini AI intelligence on your Vercel deployment, please add your \`GEMINI_API_KEY\` to your Vercel Project Settings > Environment Variables.`,
          warning: 'API key not configured in environment variables.'
        });
      }

      return res.status(500).json({ 
        error: 'API key is not configured on the server. Please add GEMINI_API_KEY in your Vercel Project Settings -> Environment Variables, or in your .env file.' 
      });
    }
    
    const ai = new GoogleGenAI({ apiKey });

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
