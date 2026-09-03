import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { 
  Send, Sparkles, User, Bot, Trash2, Copy, Check, RotateCcw, 
  ArrowDown, Lightbulb, Code2, PenTool, Brain, AlertCircle 
} from 'lucide-react';
import { callAIChat, ChatMessage } from '../utils/aiApi';

interface StoredMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  {
    icon: Lightbulb,
    title: 'Brainstorm Ideas',
    prompt: 'Give me 5 unique digital product or startup ideas with strong market potential.'
  },
  {
    icon: Code2,
    title: 'Write or Debug Code',
    prompt: 'Write a TypeScript function to debounce an async search API call with error handling.'
  },
  {
    icon: PenTool,
    title: 'Draft & Polish Writing',
    prompt: 'Write a professional, friendly email introducing our new productivity suite to a client.'
  },
  {
    icon: Brain,
    title: 'Explain Complex Topics',
    prompt: 'Explain how Large Language Models and Attention mechanisms work in simple terms.'
  }
];

export const GeminiChatbot: React.FC = () => {
  const [messages, setMessages] = useState<StoredMessage[]>(() => {
    try {
      const saved = localStorage.getItem('gemini_chat_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('gemini_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    setError(null);
    setInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage: StoredMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Map to ChatMessage format for API
      const apiMessages: ChatMessage[] = updatedMessages.slice(-10).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content
      }));

      const reply = await callAIChat(apiMessages);

      const assistantMessage: StoredMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to get a response. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      setMessages([]);
      localStorage.removeItem('gemini_chat_history');
      setError(null);
    }
  };

  const handleRegenerate = () => {
    if (loading || messages.length === 0) return;
    // Find last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserMessageIndex !== -1) {
      const realIndex = messages.length - 1 - lastUserMessageIndex;
      const lastUserMsg = messages[realIndex];
      // remove everything after that user message
      const pruned = messages.slice(0, realIndex + 1);
      setMessages(pruned);
      
      setLoading(true);
      setError(null);

      const apiMessages: ChatMessage[] = pruned.slice(-10).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content
      }));

      callAIChat(apiMessages)
        .then(reply => {
          const assistantMessage: StoredMessage = {
            id: 'assistant-' + Date.now(),
            role: 'assistant',
            content: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, assistantMessage]);
        })
        .catch(err => {
          setError(err.message || 'Failed to regenerate response.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="flex flex-col h-[750px] max-h-[85vh] bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
      {/* Top Header - Gemini / ChatGPT Style */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/90 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                Gemini AI Chatbot
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                2.5 Flash
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online • Multi-turn Assistant</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <button
                onClick={handleRegenerate}
                disabled={loading}
                title="Regenerate last response"
                className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={clearChat}
                title="Clear conversation"
                className="p-2 text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Messages Viewport */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-10">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-3.5 shadow-lg shadow-indigo-500/20 text-white mb-6">
              <Bot className="w-full h-full" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              How can I help you today?
            </h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 max-w-md">
              Ask questions, generate content, solve code problems, or brainstorm creative ideas with next-gen Gemini intelligence.
            </p>

            {/* Prompt Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
              {SUGGESTED_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all duration-200 group text-left"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {item.prompt}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl px-5 py-4 ${
                  isUser 
                    ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                    : 'bg-gray-50 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-100 dark:border-gray-700/60 shadow-xs'
                }`}>
                  <div className="flex items-center justify-between gap-3 mb-1 text-xs">
                    <span className={`font-semibold ${isUser ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`}>
                      {isUser ? 'You' : 'Gemini'}
                    </span>
                    <span className={`text-[11px] ${isUser ? 'text-indigo-200/80' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser ? (
                    <p className="text-sm font-normal whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  ) : (
                    <div className="markdown-body text-sm leading-relaxed prose dark:prose-invert max-w-none break-words">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  )}

                  {!isUser && (
                    <div className="mt-3 pt-2.5 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-end gap-2">
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading / Typing State */}
        {loading && (
          <div className="flex gap-3 sm:gap-4 justify-start items-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/80 rounded-3xl rounded-tl-sm px-5 py-4 border border-gray-100 dark:border-gray-700/60 shadow-xs flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Gemini is thinking
              </span>
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></span>
              </span>
            </div>
          </div>
        )}

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Section (ChatGPT / Gemini Dock) */}
      <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end bg-gray-50 dark:bg-gray-800/90 rounded-3xl border border-gray-200 dark:border-gray-700 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 shadow-inner px-4 py-3 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask Gemini anything... (Press Enter to send, Shift+Enter for new line)"
              disabled={loading}
              className="flex-1 max-h-36 bg-transparent outline-none resize-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 leading-relaxed min-w-0"
            />
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-9 h-9 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white flex items-center justify-center transition-all shadow-md transform hover:scale-105 active:scale-95 disabled:transform-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 mt-2 font-medium">
            Gemini may provide inaccurate info. Double-check important details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatbot;
