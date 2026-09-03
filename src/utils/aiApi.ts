export interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export const callAI = async (prompt: string, image?: string) => {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, image })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to call AI API');
  }
  return data.text;
};

export const callAIChat = async (
  messages: ChatMessage[],
  systemInstruction?: string
) => {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      systemInstruction: systemInstruction || 'You are Gemini, a helpful, intelligent, witty, and capable AI assistant created to help with questions, writing, brainstorming, math, code, and everyday queries. Format responses cleanly using Markdown, code snippets, and bullet points where helpful.'
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to communicate with AI');
  }
  return data.text as string;
};
