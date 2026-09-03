import React, { useState, useRef } from 'react';
import { Download, ExternalLink, Sparkles, Image as ImageIcon, Send, Copy, AlertTriangle, Check, Hash, Stethoscope, Camera } from 'lucide-react';
import { callAI } from '../utils/aiApi';
import { GeminiChatbot } from './GeminiChatbot';
import { AIGirlfriendWhatsApp } from './AIGirlfriendWhatsApp';

const LANGUAGES = [
  'English', 'Urdu', 'Roman Urdu', 'Hindi', 'Arabic', 'Spanish', 
  'French', 'German', 'Portuguese', 'Chinese', 'Japanese', 
  'Korean', 'Turkish', 'Indonesian', 'Bengali', 'Other'
];

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 
  'English', 'Urdu', 'History', 'Geography', 'General Science', 'General Knowledge', 'Other'
];

interface AIToolProps {
  toolType: string;
}

export const AIToolRenderer: React.FC<AIToolProps> = ({ toolType }) => {
  const [input, setInput] = useState('');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [tone, setTone] = useState('SEO-friendly');
  const [numResults, setNumResults] = useState('5');
  const [subject, setSubject] = useState('Mathematics');
  const [customSubject, setCustomSubject] = useState('');
  const [language, setLanguage] = useState('English');
  const [customLanguage, setCustomLanguage] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState('1024x1024');
  const [imageCount, setImageCount] = useState('1');
  const [negativePrompt, setNegativePrompt] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const getActualLanguage = () => language === 'Other' ? customLanguage : language;
  const getActualSubject = () => subject === 'Other' ? customSubject : subject;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (prompt: string, withImage: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      if (withImage && !image) {
        throw new Error("Please upload an image first.");
      }
      const response = await callAI(prompt, withImage ? image : undefined);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderLanguageSelect = () => (
    <div className="mb-5">
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Output Language</label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all shadow-inner font-medium text-gray-800 dark:text-gray-200">
        {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      {language === 'Other' && (
        <input type="text" placeholder="Type your language..." value={customLanguage} onChange={(e) => setCustomLanguage(e.target.value)} className="w-full mt-3 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all shadow-inner font-medium text-gray-800 dark:text-gray-200" />
      )}
    </div>
  );

  const renderSubjectSelect = () => (
    <div className="mb-5">
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
      <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all shadow-inner font-medium text-gray-800 dark:text-gray-200">
        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      {subject === 'Other' && (
        <input type="text" placeholder="Type subject..." value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} className="w-full mt-3 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all shadow-inner font-medium text-gray-800 dark:text-gray-200" />
      )}
    </div>
  );

  const renderImageUpload = () => (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Upload Image / Picture</label>
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-4 px-4 bg-white dark:bg-gray-800 border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
          <ImageIcon className="w-5 h-5 mr-2" /> Upload Photo
        </button>
        <button onClick={() => cameraInputRef.current?.click()} className="flex-1 py-4 px-4 bg-white dark:bg-gray-800 border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
          <Camera className="w-5 h-5 mr-2" /> Take Photo
        </button>
      </div>
      <input type="file" accept="image/jpeg,image/png,image/webp" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
      <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" ref={cameraInputRef} onChange={handleImageUpload} className="hidden" />
      {image && (
        <div className="mt-4 relative inline-block p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <img src={image} alt="Uploaded" className="h-40 rounded-xl object-contain" />
          <button onClick={() => setImage(null)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg hover:bg-red-600 transition-colors">×</button>
        </div>
      )}
    </div>
  );

  const renderOutputPanel = () => (
    <div className="flex flex-col h-full min-w-0 min-h-[400px]">
      <div className="flex justify-between items-center mb-3">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">AI Result / Output</label>
        <button onClick={copyToClipboard} disabled={!result} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center text-sm font-bold bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="flex-1 w-full p-6 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-3xl shadow-inner relative overflow-y-auto">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 rounded-3xl">
            <Sparkles className="w-10 h-10 text-indigo-500 animate-pulse mb-4" />
            <p className="text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">AI is thinking...</p>
          </div>
        ) : result ? (
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-base leading-relaxed">
            {result}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 opacity-70">
            <Sparkles className="w-12 h-12 mb-3 opacity-50" />
            <p className="font-medium text-center px-4">Your AI generated result will appear here.<br/>Fill in the details on the left and click generate.</p>
          </div>
        )}
      </div>
    </div>
  );

  
  const handleGenerateImages = async () => {
    if (!input) {
        setError('Please enter a description for the image.');
        return;
    }
    setLoading(true);
    setError(null);
    setGeneratedImages([]);
    
    const [width, height] = aspectRatio.split('x').map(Number);
    const count = Number(imageCount);
    
    try {
      const jobs = [];
      for(let i=0; i<count; i++) {
        const seed = Math.floor(Math.random() * 1000000000);
        let finalPrompt = input;
        if (negativePrompt) {
          finalPrompt += ", avoid: " + negativePrompt;
        }
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
        
        jobs.push(new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = () => reject(new Error('Image failed to load'));
          img.src = url;
        }));
      }
      
      const results = await Promise.allSettled(jobs);
      const successfulImages = results
        .filter((res): res is PromiseFulfilledResult<string> => res.status === 'fulfilled')
        .map(res => res.value);
        
      if (successfulImages.length === 0) {
        throw new Error('Failed to generate any images.');
      }
      setGeneratedImages(successfulImages);
      setResult('Success'); // Trigger scroll if needed
    } catch (err: any) {
      setError(err.message || 'Failed to generate images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      window.open(url, '_blank');
    }
  };


  const renderLayout = (leftPanel: React.ReactNode, customRightPanel?: React.ReactNode) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      <div className="flex flex-col bg-white min-w-0 dark:bg-gray-800 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
        {leftPanel}
        {error && <div className="p-4 mt-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/50 flex items-start"><AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" /> {error}</div>}
      </div>
      <div className="flex flex-col h-full min-w-0">
        {customRightPanel || renderOutputPanel()}
      </div>
    </div>
  );

  
  if (toolType === 'ai_image_generator') {
    const rightPanel = (
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Generated Images</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {loading ? 'Generating...' : generatedImages.length > 0 ? `${generatedImages.length} image${generatedImages.length > 1 ? 's' : ''} generated` : 'Ready'}
          </span>
        </div>
        
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center min-w-0">
            <div className="w-12 h-12 border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-gray-900 dark:text-gray-100">Creating your image...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">AI is working on your prompt</p>
          </div>
        ) : generatedImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-2">
            {generatedImages.map((url, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex flex-col min-w-0">
                <img src={url} alt="AI generated" className="w-full aspect-square object-cover" loading="lazy" />
                <div className="p-3 flex gap-2">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <ExternalLink className="w-4 h-4" /> Open
                  </a>
                  <button onClick={() => downloadImage(url)} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors">
                    <Download className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl min-w-0">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Your creations appear here</h3>
            <p className="text-gray-500 dark:text-gray-400">Enter a prompt and click Generate.</p>
          </div>
        )}
      </div>
    );
    
    return renderLayout(
          <>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Image Prompt</label>
              <textarea 
                className="w-full h-32 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none resize-none shadow-inner text-gray-800 dark:text-gray-200 box-border min-w-0 break-words"
                placeholder="Example: A futuristic cyberpunk city at night, neon lights, cinematic atmosphere, ultra detailed..."
                value={input}
                onChange={e => setInput(e.target.value)}
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Negative Prompt <span className="text-gray-400 font-normal">(optional)</span></label>
              <input 
                type="text"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all shadow-inner font-medium text-gray-800 dark:text-gray-200 box-border min-w-0"
                placeholder="blurry, low quality, distorted"
                value={negativePrompt}
                onChange={e => setNegativePrompt(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="min-w-0">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Aspect Ratio</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-gray-800 dark:text-gray-200 cursor-pointer appearance-none box-border min-w-0"
                  value={aspectRatio}
                  onChange={e => setAspectRatio(e.target.value)}
                >
                  <option value="1024x1024">Square — 1:1</option>
                  <option value="1152x768">Landscape — 3:2</option>
                  <option value="768x1152">Portrait — 2:3</option>
                  <option value="1280x720">Widescreen — 16:9</option>
                  <option value="720x1280">Vertical — 9:16</option>
                </select>
              </div>
              
              <div className="min-w-0">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Images</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-gray-800 dark:text-gray-200 cursor-pointer appearance-none box-border min-w-0"
                  value={imageCount}
                  onChange={e => setImageCount(e.target.value)}
                >
                  <option value="1">1 Image</option>
                  <option value="2">2 Images</option>
                  <option value="3">3 Images</option>
                  <option value="4">4 Images</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleGenerateImages}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_-8px_rgba(79,70,229,0.6)] hover:shadow-[0_12px_25px_-8px_rgba(79,70,229,0.8)] transform hover:-translate-y-1 disabled:transform-none"
            >
              <Sparkles className="w-5 h-5" /> 
              {loading ? 'Generating...' : 'Generate Images'}
            </button>
            <p className="text-center mt-4 text-xs font-medium text-gray-400 dark:text-gray-500">
              Powered by Pollinations AI
            </p>
          </>
  , rightPanel);
  }

  if (toolType === 'ai_solver') {
    return renderLayout(
      <>
        {renderSubjectSelect()}
        {renderLanguageSelect()}
        {renderImageUpload()}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Question (Optional if image is uploaded)</label>
          <textarea 
            className="w-full h-32 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none resize-none shadow-inner text-gray-800 dark:text-gray-200"
            placeholder="Type your question here..."
            value={input}
            onChange={e => setInput(e.target.value)}
          ></textarea>
        </div>
        <button 
          onClick={() => {
            const prompt = `Act as an expert educational tutor. I need help with ${getActualSubject()}. ${input ? 'Here is my question: ' + input : 'Please read the question from the attached image and solve it.'} \nIMPORTANT: You must respond entirely in this language: ${getActualLanguage()}. \nProvide a clear, step-by-step explanation. Prioritize understanding.`;
            handleGenerate(prompt, !!image);
          }}
          disabled={loading || (!input && !image)}
          className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-extrabold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center"
        >
          {loading ? 'Thinking...' : <><Sparkles className="w-5 h-5 mr-2" /> Solve Question</>}
        </button>
      </>
  );
  }

  if (toolType === 'ai_image_solver') {
    return renderLayout(
      <>
        {renderLanguageSelect()}
        {renderImageUpload()}
        <button 
          onClick={() => {
            const prompt = `Act as an expert educational tutor. Please extract and read the question from the attached image, identify it, solve it, and explain the answer step by step. If it's unclear, politely say it's unclear.\nIMPORTANT: You must respond entirely in this language: ${getActualLanguage()}.`;
            handleGenerate(prompt, true);
          }}
          disabled={loading || !image}
          className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-extrabold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center mt-auto"
        >
          {loading ? 'Analyzing...' : <><ImageIcon className="w-5 h-5 mr-2" /> Solve from Image</>}
        </button>
      </>
  );
  }

  if (toolType === 'ai_text_solver') {
    return renderLayout(
      <>
        {renderSubjectSelect()}
        {renderLanguageSelect()}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Questions (Paste multiple)</label>
          <textarea 
            className="w-full h-48 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none resize-none shadow-inner text-gray-800 dark:text-gray-200"
            placeholder="Paste your questions here..."
            value={input}
            onChange={e => setInput(e.target.value)}
          ></textarea>
        </div>
        <button 
          onClick={() => {
            const prompt = `Act as an expert educational tutor for the subject: ${getActualSubject()}. \nI have pasted multiple questions below. Please answer them one by one. Separate answers clearly (e.g. Question 1 / Answer 1). Provide explanations for educational understanding.\nIMPORTANT: You must respond entirely in this language: ${getActualLanguage()}.\nQuestions:\n${input}`;
            handleGenerate(prompt, false);
          }}
          disabled={loading || !input}
          className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-extrabold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center"
        >
          {loading ? 'Thinking...' : <><Sparkles className="w-5 h-5 mr-2" /> Solve Questions</>}
        </button>
      </>
  );
  }

  if (toolType === 'ai_video_title') {
    return renderLayout(
      <>
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Video Topic / Idea</label>
          <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all shadow-inner font-medium text-gray-800 dark:text-gray-200" placeholder="e.g. How to make pasta..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="min-w-0">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Target Platform</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-gray-800 dark:text-gray-200">
              {['YouTube', 'TikTok', 'Instagram', 'Facebook'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="min-w-0">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Number of titles</label>
            <input type="number" min="1" max="15" value={numResults} onChange={e => setNumResults(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-gray-800 dark:text-gray-200" />
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tone</label>
          <select value={tone} onChange={e => setTone(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-gray-800 dark:text-gray-200">
            {['SEO-friendly', 'Educational', 'Viral-style', 'Short', 'Professional', 'Curiosity-based'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        {renderLanguageSelect()}
        <button 
          onClick={() => {
            const prompt = `Act as an expert content creator. Generate ${numResults} highly engaging video titles for ${platform}. Topic: ${topic}. Tone: ${tone}. Output as a numbered list.\nIMPORTANT: You must respond entirely in this language: ${getActualLanguage()}.`;
            handleGenerate(prompt, false);
          }}
          disabled={loading || !topic}
          className="w-full mt-4 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-extrabold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center"
        >
          {loading ? 'Generating...' : <><Sparkles className="w-5 h-5 mr-2" /> Generate Titles</>}
        </button>
      </>
  );
  }

  if (toolType === 'ai_hashtag') {
    return renderLayout(
      <>
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Topic / Niche</label>
          <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all shadow-inner font-medium text-gray-800 dark:text-gray-200" placeholder="e.g. Travel vlog in Japan..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="min-w-0">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Platform</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-gray-800 dark:text-gray-200">
              {['YouTube', 'TikTok', 'Instagram', 'Facebook', 'Twitter/X'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="min-w-0">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Hashtag Count</label>
            <input type="number" min="5" max="30" value={numResults} onChange={e => setNumResults(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-gray-800 dark:text-gray-200" />
          </div>
        </div>
        {renderLanguageSelect()}
        <button 
          onClick={() => {
            const prompt = `Act as an expert social media manager. Generate ${numResults} relevant hashtags for ${platform} for the niche/topic: ${topic}. Separate them clearly with spaces.\nIMPORTANT: You must respond entirely in this language: ${getActualLanguage()}.`;
            handleGenerate(prompt, false);
          }}
          disabled={loading || !topic}
          className="w-full mt-4 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-extrabold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center"
        >
          {loading ? 'Generating...' : <><Hash className="w-5 h-5 mr-2" /> Generate Hashtags</>}
        </button>
      </>
  );
  }

  if (toolType === 'ai_chatbot') {
    return <GeminiChatbot />;
  }

  if (toolType === 'ai_girlfriend') {
    return <AIGirlfriendWhatsApp />;
  }

  if (toolType === 'ai_health') {
    return renderLayout(
      <>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-5 rounded-2xl flex items-start mb-6">
          <AlertTriangle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-800 dark:text-orange-300 font-medium leading-relaxed">
            AI-generated information is for general educational purposes and is not a substitute for professional medical advice. Do not use this tool for diagnosing conditions.
          </p>
        </div>
        {renderLanguageSelect()}
        {renderImageUpload()}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Medicine Name (Optional if image provided)</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none shadow-inner font-medium text-gray-800 dark:text-gray-200" placeholder="e.g. Paracetamol..." />
        </div>
        <button 
          onClick={() => {
            const prompt = `You provide health information for educational purposes only.\nI provide a medicine name: "${input}" and/or image.\nExtract facts: Possible ID, Active ingredient, General use, Precautions. Do not diagnose. End with: "AI-generated information is for general educational purposes and is not a substitute for professional medical advice."\nIMPORTANT: Respond in this language: ${getActualLanguage()}.`;
            handleGenerate(prompt, !!image);
          }}
          disabled={loading || (!input && !image)}
          className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-extrabold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center mt-auto"
        >
          {loading ? 'Analyzing...' : <><Stethoscope className="w-5 h-5 mr-2" /> Analyze Medicine</>}
        </button>
      </>
  );
  }

  if (toolType === 'ai_prompt_hub' || toolType === 'ai_image_prompt' || toolType === 'ai_video_prompt') {
    const isImage = toolType === 'ai_image_prompt';
    const isVideo = toolType === 'ai_video_prompt';
    const mode = isImage ? 'Image' : (isVideo ? 'Video' : 'General');
    
    return renderLayout(
      <>
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Your {mode} Idea</label>
          <textarea 
            className="w-full h-40 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none resize-none shadow-inner text-gray-800 dark:text-gray-200"
            placeholder={`Describe your ${mode.toLowerCase()} idea here...`}
            value={input}
            onChange={e => setInput(e.target.value)}
          ></textarea>
        </div>
        {renderLanguageSelect()}
        <button 
          onClick={() => {
            let promptBase = '';
            if (isImage) {
                promptBase = `Act as an expert AI prompt engineer. Turn this user idea into a detailed, highly-descriptive prompt for an AI Image Generator (like Midjourney or DALL-E).`;
            } else if (isVideo) {
                promptBase = `Act as an expert AI prompt engineer. Turn this user idea into a detailed prompt for an AI Video Generator (like Sora or Runway).`;
            } else {
                promptBase = `Act as an expert AI prompt engineer. Turn this user idea into a professional prompt for an AI assistant (like ChatGPT or Gemini).`;
            }
            const prompt = `${promptBase}\nUser Idea: ${input}\nIMPORTANT: Output the generated prompt entirely in this language: ${getActualLanguage()}.`;
            handleGenerate(prompt, false);
          }}
          disabled={loading || !input}
          className="w-full mt-4 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-extrabold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center"
        >
          {loading ? 'Generating...' : <><Sparkles className="w-5 h-5 mr-2" /> Generate {mode} Prompt</>}
        </button>
      </>
  );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-xl font-bold text-gray-900">Tool Configuration Error</h3>
      <p className="text-gray-500 mt-2">The requested AI tool "{toolType}" could not be rendered.</p>
    </div>
  );
};
