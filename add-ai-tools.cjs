const fs = require('fs');

let content = fs.readFileSync('src/toolsData.ts', 'utf-8');

// We need to add the imports for icons
const iconsToAdd = ['BrainCircuit', 'Image', 'MessageSquare', 'Video', 'Hash', 'Stethoscope', 'Sparkles', 'Lightbulb'];
for (const icon of iconsToAdd) {
    if (!content.includes(icon)) {
        content = content.replace("import { ", `import { ${icon}, `);
    }
}

const aiTools = `
  // AI TOOLS
  {
    id: 'ai-question-solver',
    title: 'AI Question Solver',
    seoTitle: 'AI Question Solver - Get Instant Explanations & Answers',
    seoDescription: 'Solve complex questions with AI. Upload an image or type your question. Supports Mathematics, Physics, English and more in multiple languages.',
    h1: 'AI Question Solver',
    intro: 'Upload a picture of your homework or type a question to get a detailed step-by-step AI explanation.',
    description: 'Our AI Question Solver acts as your personal tutor. Whether you need help with a difficult math problem, a physics concept, or English grammar, just ask.',
    category: 'AI Tools',
    icon: BrainCircuit,
    type: 'ai_solver',
    action: () => ''
  },
  {
    id: 'ai-question-solver-image',
    title: 'Image Question Solver',
    seoTitle: 'AI Image Question Solver - Upload Photo for Answers',
    seoDescription: 'Take a photo of your question and get an instant AI solution. Reads handwritten or printed questions.',
    h1: 'AI Image Question Solver',
    intro: 'Upload a clear picture of your question and let our AI analyze and solve it.',
    description: 'Stuck on a problem? Just snap a picture. Our Image Question Solver extracts the text and provides a comprehensive explanation.',
    category: 'AI Tools',
    icon: Image,
    type: 'ai_image_solver',
    action: () => ''
  },
  {
    id: 'ai-text-question-solver',
    title: 'Text Question Solver',
    seoTitle: 'AI Text Question Solver - Multi-Question AI Tutor',
    seoDescription: 'Paste multiple questions at once and get separate, detailed AI explanations. Fast and free AI learning assistant.',
    h1: 'Text Question Solver',
    intro: 'Have a list of questions? Paste them here and our AI will solve them one by one.',
    description: 'Perfect for study guides and multiple-choice questions. Paste your text block and get distinct, organized answers for each question.',
    category: 'AI Tools',
    icon: BrainCircuit,
    type: 'ai_text_solver',
    action: () => ''
  },
  {
    id: 'ai-video-title-generator',
    title: 'AI Video Title Generator',
    seoTitle: 'AI Video Title Generator for YouTube & TikTok',
    seoDescription: 'Generate catchy, SEO-friendly titles for your YouTube, TikTok, and Instagram videos. Maximize your views with AI.',
    h1: 'AI Video Title Generator',
    intro: 'Create high-converting, curiosity-driven titles for your next viral video.',
    description: 'Stop struggling with video titles. Enter your video topic and let AI generate optimized, clickable titles tailored for your specific platform.',
    category: 'AI Tools',
    icon: Video,
    type: 'ai_video_title',
    action: () => ''
  },
  {
    id: 'ai-hashtag-generator',
    title: 'AI Hashtag Generator',
    seoTitle: 'AI Hashtag Generator - Boost Social Media Reach',
    seoDescription: 'Generate relevant, trending hashtags for Instagram, TikTok, and YouTube. Boost your post engagement instantly.',
    h1: 'AI Hashtag Generator',
    intro: 'Find the best hashtags to reach your target audience and grow your followers.',
    description: 'Our AI analyzes your topic and suggests the most effective mix of popular and niche hashtags for maximum discoverability.',
    category: 'AI Tools',
    icon: Hash,
    type: 'ai_hashtag',
    action: () => ''
  },
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot',
    seoTitle: 'Free AI Chatbot - Your Smart Virtual Assistant',
    seoDescription: 'Chat with our intelligent AI assistant. Get help with writing, coding, brainstorming, and translation.',
    h1: 'AI Chatbot Assistant',
    intro: 'Ask anything. Your smart, multilingual conversational partner is ready to help.',
    description: 'Need a quick summary, a code snippet, or someone to brainstorm ideas with? Our versatile AI chatbot is designed to assist you with a wide range of tasks.',
    category: 'AI Tools',
    icon: MessageSquare,
    type: 'ai_chatbot',
    action: () => ''
  },
  {
    id: 'ai-health-information',
    title: 'AI Health Information',
    seoTitle: 'AI Medicine Identifier & Health Info',
    seoDescription: 'Identify medicines from images or names and get general AI health information. Educational purposes only.',
    h1: 'AI Health & Medicine Info',
    intro: 'Upload a medicine package or enter its name for general informational details and precautions.',
    description: 'Learn more about active ingredients, common uses, and general warnings. Note: This tool does not provide medical advice and is not a substitute for a doctor.',
    category: 'AI Tools',
    icon: Stethoscope,
    type: 'ai_health',
    action: () => ''
  },
  {
    id: 'ai-prompt-generator',
    title: 'AI Prompt Hub',
    seoTitle: 'AI Prompt Generator Hub - Master AI Prompts',
    seoDescription: 'Generate professional prompts for ChatGPT, Midjourney, and more. Improve your AI outputs instantly.',
    h1: 'AI Prompt Generator Hub',
    intro: 'Turn your simple idea into a perfectly structured AI prompt.',
    description: 'The secret to great AI results is a great prompt. Use our hub to generate optimized prompts for text, image, and video generation models.',
    category: 'AI Tools',
    icon: Sparkles,
    type: 'ai_prompt_hub',
    action: () => ''
  },
  {
    id: 'ai-image-prompt-generator',
    title: 'Image Prompt Generator',
    seoTitle: 'AI Image Prompt Generator for Midjourney & DALL-E',
    seoDescription: 'Create detailed, highly-descriptive image generation prompts. Specify lighting, style, and camera angles.',
    h1: 'AI Image Prompt Generator',
    intro: 'Describe your vision, and we will craft the perfect prompt for AI image generators.',
    description: 'Get the exact image you want by generating a prompt that includes essential details like art style, lighting, composition, and mood.',
    category: 'AI Tools',
    icon: Image,
    type: 'ai_image_prompt',
    action: () => ''
  },
  {
    id: 'ai-video-prompt-generator',
    title: 'Video Prompt Generator',
    seoTitle: 'AI Video Prompt Generator - Sora & Runway',
    seoDescription: 'Generate advanced prompts for AI video models. Structure your scene, camera movement, and lighting.',
    h1: 'AI Video Prompt Generator',
    intro: 'Plan your AI video scene perfectly with structured, detailed prompts.',
    description: 'AI video generation requires precise instructions for motion, camera angles, and action. Use this tool to build prompts that yield professional results.',
    category: 'AI Tools',
    icon: Video,
    type: 'ai_video_prompt',
    action: () => ''
  },
`;

content = content.replace("export const tools: Tool[] = [", "export const tools: Tool[] = [\n" + aiTools);

fs.writeFileSync('src/toolsData.ts', content);
