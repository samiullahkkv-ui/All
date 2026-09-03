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
