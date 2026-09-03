export type ToolCategory = 'AI Tools' | 'Text Tools' | 'Developer' | 'Generators' | 'Calculators' | 'Converters' | 'Media Tools' | 'Document Tools' | 'Web Tools';

export type ToolType = 'ai_solver' | 'ai_image_solver' | 'ai_text_solver' | 'ai_video_title' | 'ai_hashtag' | 'ai_chatbot' | 'ai_girlfriend' | 'ai_health' | 'ai_prompt_hub' | 'ai_image_prompt' | 'ai_video_prompt' | 'ai_image_generator' | 'custom' | 'text' | 'generator' | 'calculator' | 'image_compressor' | 'image_converter' | 'text_to_pdf' | 'html_viewer' | 'url_shortener' | 'text_to_file' | 'pwa_generator' | 'web_to_app' | 'image_hosting';

export interface ToolInput {
  name: string;
  label: string;
  placeholder?: string;
}

export interface Tool {
  id: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  h1?: string;
  intro?: string;
  description: string;
  category: ToolCategory;
  icon: any; // Lucide icon component
  image?: string;
  type: ToolType;
  inputs?: ToolInput[];
  action: (...args: any[]) => string | number;
  content?: string;
  howToUse?: string[];
  faq?: { question: string; answer: string }[];
  relatedTools?: string[];
}
