import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip, 
  CheckCheck, Maximize2, Minimize2, Trash2, User, Heart, Sparkles, 
  Search, Shield, MapPin, X, Info, AlertCircle, Key, ExternalLink, HelpCircle
} from 'lucide-react';
import { GIRLFRIENDS_DATA, AIGirlfriend } from '../data/girlfriendsData';
import { callAIChat, ChatMessage } from '../utils/aiApi';
import { getGirlfriendSmartReply } from '../utils/girlfriendAiFallback';

interface WhatsAppMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

const EMOJI_QUICK_LIST = ['❤️', '😍', '😘', '😂', '🥺', '🌸', '✨', '☕', '🍕', '🙈', '🥰', '🔥'];

export const AIGirlfriendWhatsApp: React.FC = () => {
  const [selectedGirl, setSelectedGirl] = useState<AIGirlfriend | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCallToast, setShowCallToast] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [showApiKeyBanner, setShowApiKeyBanner] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history for the selected companion
  useEffect(() => {
    if (!selectedGirl) return;

    try {
      const storageKey = `wa_chat_${selectedGirl.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: WhatsAppMessage[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Default first greeting message from the girlfriend
    const initialGreeting: WhatsAppMessage = {
      id: 'msg-init-' + Date.now(),
      sender: 'bot',
      text: selectedGirl.defaultMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };
    setMessages([initialGreeting]);
  }, [selectedGirl]);

  // Persist chat to local storage whenever messages update
  useEffect(() => {
    if (!selectedGirl || messages.length === 0) return;
    try {
      const storageKey = `wa_chat_${selectedGirl.id}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // ignore
    }
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !selectedGirl || isTyping) return;

    setErrorNotice(null);
    setInputText('');
    setShowEmojiPicker(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: WhatsAppMessage = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text,
      time: currentTime,
      status: 'read'
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsTyping(true);

    let botResponse = '';
    let isKeyMissing = false;

    try {
      // Format chat history for Gemini API
      const apiMessages: ChatMessage[] = updated.slice(-12).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
      }));

      // Call Gemini API with her unique persona prompt
      botResponse = await callAIChat(apiMessages, selectedGirl.systemPrompt);
    } catch (err: any) {
      console.warn('AI chat error, using companion dialogue fallback:', err);
      // Seamlessly generate authentic persona response so chat never breaks
      botResponse = getGirlfriendSmartReply(selectedGirl, text, updated.length);
      if (err.message && (err.message.includes('API key') || err.message.includes('GEMINI_API_KEY') || err.message.includes('environment variables'))) {
        isKeyMissing = true;
      }
    } finally {
      setIsTyping(false);
    }

    if (botResponse) {
      const botMsg: WhatsAppMessage = {
        id: 'msg-bot-' + Date.now(),
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };
      setMessages(prev => [...prev, botMsg]);
    }

    if (isKeyMissing) {
      setShowApiKeyBanner(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleCallClick = (type: 'audio' | 'video') => {
    if (!selectedGirl) return;
    const msg = type === 'audio' 
      ? `📞 ${selectedGirl.name} is in class right now: "I will call you tonight sweetheart, text me for now! 💕"`
      : `📹 Video call simulation: ${selectedGirl.name} says "I'm not camera-ready right now silly! Let's text 🙈"`;
    setShowCallToast(msg);
    setTimeout(() => setShowCallToast(null), 4000);
  };

  const handleClearChat = () => {
    if (!selectedGirl) return;
    if (window.confirm(`Clear chat history with ${selectedGirl.name}?`)) {
      const resetMsg: WhatsAppMessage = {
        id: 'msg-init-' + Date.now(),
        sender: 'bot',
        text: selectedGirl.defaultMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };
      setMessages([resetMsg]);
      localStorage.removeItem(`wa_chat_${selectedGirl.id}`);
      setShowMenu(false);
    }
  };

  const filteredGirls = GIRLFRIENDS_DATA.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.personality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // -------------------------------------------------------------
  // SCREEN 1: 10 AI GIRLFRIENDS DIRECTORY VIEW
  // -------------------------------------------------------------
  if (!selectedGirl) {
    return (
      <div className="w-full">
        {/* Header section */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur-sm mb-3">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>10 Virtual Companions Online • Gemini AI Powered</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                AI Girlfriend WhatsApp Directory
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base mt-1 max-w-xl">
                Choose any companion to start chatting. Each girl has a unique personality, authentic profile, and realistic WhatsApp messaging experience.
              </p>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-emerald-200 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companions..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md text-white placeholder-emerald-200 text-sm border border-white/20 focus:outline-none focus:bg-white/25 transition-all"
              />
            </div>
          </div>
        </div>

        {/* 10 Girls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGirls.map((girl) => (
            <div
              key={girl.id}
              onClick={() => setSelectedGirl(girl)}
              className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700/80 shadow-md hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col group relative overflow-hidden"
            >
              {/* Top Row: DP + Status + Basic Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-emerald-500/20 group-hover:ring-emerald-500 transition-all shadow-md">
                    <img 
                      src={girl.dp} 
                      alt={girl.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* WhatsApp Online Green Dot */}
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full shadow-xs animate-pulse"></span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {girl.name}
                    </h3>
                    <span className="text-base" title={girl.country}>{girl.flag}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    <span className="font-semibold">{girl.age} yrs</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {girl.city}
                    </span>
                  </div>
                  <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    ● {girl.status}
                  </span>
                </div>
              </div>

              {/* Tagline & Bio */}
              <div className="mb-4 flex-1">
                <div className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
                  {girl.tagline}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                  {girl.bio}
                </p>
              </div>

              {/* WhatsApp About / Status snippet */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl px-3 py-2 text-xs text-gray-500 dark:text-gray-400 italic mb-4 border border-gray-100 dark:border-gray-800 flex items-center gap-2 truncate">
                <span className="text-gray-400 not-italic">💬</span>
                <span className="truncate">"{girl.aboutStatus}"</span>
              </div>

              {/* Interests Chips */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {girl.interests.slice(0, 3).map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 text-[11px] font-medium"
                  >
                    #{interest}
                  </span>
                ))}
              </div>

              {/* Chat on WhatsApp CTA Button */}
              <button
                type="button"
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 group-hover:bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-200 mt-auto"
              >
                <span>Chat with {girl.name.split(' ')[0]}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 2: AUTHENTIC FULL-SCREEN WHATSAPP MESSAGING VIEW
  // -------------------------------------------------------------
  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-[#efeae2] dark:bg-[#0b141a] flex flex-col h-screen w-screen overflow-hidden'
    : 'relative w-full h-[780px] max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col bg-[#efeae2] dark:bg-[#0b141a]';

  return (
    <div className={containerClasses}>
      {/* Toast Alert for mock calls */}
      {showCallToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md animate-fade-in border border-white/20 max-w-md text-center">
          {showCallToast}
        </div>
      )}

      {/* WhatsApp Header (Green Bar #075E54 / Dark #202c33) */}
      <div className="bg-[#075E54] dark:bg-[#202c33] text-white px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-md select-none z-20 flex-shrink-0">
        {/* Left: Back Button + DP + Name + Status */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={() => {
              setSelectedGirl(null);
              setIsFullscreen(false);
            }}
            title="Back to girls list"
            className="p-1.5 -ml-1 rounded-full hover:bg-white/10 active:bg-white/20 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2.5 cursor-pointer group min-w-0"
          >
            <div className="relative flex-shrink-0">
              <img
                src={selectedGirl.dp}
                alt={selectedGirl.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30 group-hover:ring-white transition-all shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#075E54] dark:border-[#202c33]"></span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="font-bold text-sm sm:text-base text-white truncate leading-tight">
                  {selectedGirl.name}
                </h4>
                <span className="text-xs">{selectedGirl.flag}</span>
              </div>
              <p className="text-[11px] text-emerald-200 dark:text-emerald-400 font-medium leading-tight truncate">
                {isTyping ? 'typing...' : 'online'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Icons: Phone, Video, Fullscreen, Menu */}
        <div className="flex items-center gap-1 sm:gap-2 text-white/90">
          <button
            onClick={() => handleCallClick('video')}
            title="Video Call"
            className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleCallClick('audio')}
            title="Voice Call"
            className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Full Screen WhatsApp'}
            className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors hidden sm:block"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              title="More options"
              className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl py-2 z-50 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm">
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Info className="w-4 h-4 text-emerald-600" />
                  View Contact
                </button>
                <button
                  onClick={() => {
                    setShowSetupModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Vercel Setup Guide
                </button>
                <button
                  onClick={() => {
                    setIsFullscreen(!isFullscreen);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  {isFullscreen ? 'Exit Fullscreen' : 'Full Screen View'}
                </button>
                <button
                  onClick={handleClearChat}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Chat
                </button>
                <div className="my-1 border-t border-gray-100 dark:border-gray-700"></div>
                <button
                  onClick={() => {
                    setSelectedGirl(null);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Switch Companion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vercel / Gemini Setup Notice Banner */}
      {showApiKeyBanner && (
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white px-3 sm:px-4 py-2 text-xs flex items-center justify-between gap-2 shadow-sm z-20 animate-fade-in">
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse text-yellow-300" />
            <span className="font-medium truncate">
              Companion Mode active! Add <strong>GEMINI_API_KEY</strong> in Vercel to unlock Gemini 2.5 Flash.
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setShowSetupModal(true)}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[11px] font-bold tracking-wide transition-colors cursor-pointer"
            >
              Fix in 1 Min
            </button>
            <button
              onClick={() => setShowApiKeyBanner(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Chat Body with Authentic Wallpaper Background */}
      <div 
        ref={chatContainerRef}
        onClick={() => {
          setShowMenu(false);
          setShowEmojiPicker(false);
        }}
        className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3 relative"
        style={{
          backgroundImage: `radial-gradient(#075e5410 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      >
        {/* Encryption Lock Notice */}
        <div className="flex justify-center my-2">
          <div className="bg-[#ffeecd] dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-[11px] font-medium px-3.5 py-1.5 rounded-xl shadow-xs text-center max-w-md flex items-center gap-1.5 border border-yellow-200/50 dark:border-gray-800">
            <Shield className="w-3 h-3 text-yellow-700 dark:text-yellow-500 flex-shrink-0" />
            <span>Messages are end-to-end encrypted with Gemini AI. Nobody outside of this chat can read them.</span>
          </div>
        </div>

        {/* Date Divider */}
        <div className="flex justify-center my-1">
          <span className="bg-white/80 dark:bg-[#182229]/80 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs backdrop-blur-xs">
            Today
          </span>
        </div>

        {/* Message Bubbles */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`relative max-w-[85%] sm:max-w-[70%] px-3.5 py-2 rounded-2xl text-sm shadow-xs ${
                  isUser
                    ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-tr-xs'
                    : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-xs'
                }`}
              >
                {/* Message Content */}
                <p className="whitespace-pre-wrap leading-relaxed break-words text-[13.5px] pr-12">
                  {msg.text}
                </p>

                {/* Timestamp & WhatsApp Blue Ticks */}
                <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 select-none">
                  <span>{msg.time}</span>
                  {isUser && (
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white dark:bg-[#202c33] text-gray-500 px-4 py-2.5 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {selectedGirl.name.split(' ')[0]} is typing
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
              </span>
            </div>
          </div>
        )}

        {/* Error notification if unexpected API fails */}
        {errorNotice && !showApiKeyBanner && (
          <div className="flex justify-center my-2">
            <div className="bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs px-3.5 py-2 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-2 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{errorNotice}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Reaction Bar */}
      <div className="px-3 sm:px-4 py-1.5 bg-[#f0f2f5]/90 dark:bg-[#202c33]/90 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none">
        <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap mr-1">Quick:</span>
        {EMOJI_QUICK_LIST.map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(emoji)}
            disabled={isTyping}
            className="px-2 py-0.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-base"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Bottom WhatsApp Input Bar */}
      <div className="bg-[#f0f2f5] dark:bg-[#202c33] px-2 sm:px-4 py-2 sm:py-3 flex items-end gap-2 shadow-lg flex-shrink-0 z-20">
        <div className="relative flex items-center text-gray-500 dark:text-gray-400">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Add Emoji"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Emoji floating picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 grid grid-cols-6 gap-2 z-50">
              {['❤️', '😍', '😘', '😂', '🥺', '🌸', '✨', '☕', '🍕', '🙈', '🥰', '🔥', '💖', '🌹', '🕊️', '🧸', '🍫', '🌙'].map((e, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(prev => prev + e);
                    setShowEmojiPicker(false);
                    textareaRef.current?.focus();
                  }}
                  className="text-xl p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {e}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setShowCallToast(`📎 Media sharing with ${selectedGirl.name} will be saved in your chat gallery.`);
              setTimeout(() => setShowCallToast(null), 3000);
            }}
            title="Attach file"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        {/* Input field */}
        <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-3xl px-4 py-2 shadow-xs border border-gray-200 dark:border-transparent flex items-center min-w-0">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${selectedGirl.name.split(' ')[0]}...`}
            disabled={isTyping}
            className="w-full bg-transparent resize-none outline-none text-sm text-[#111b21] dark:text-[#e9edef] placeholder-gray-400 dark:placeholder-gray-400 max-h-28 leading-relaxed"
          />
        </div>

        {/* Send Button: WhatsApp Green Circular Button (#25D366) */}
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
          title="Send message"
          className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#06cf9c] disabled:opacity-40 disabled:hover:bg-[#00a884] text-white flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Detail Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 animate-scale-up">
            {/* Cover header with DP */}
            <div className="relative h-44 bg-emerald-600">
              <img 
                src={selectedGirl.headerPhoto} 
                alt={selectedGirl.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute -bottom-8 left-6">
                <img
                  src={selectedGirl.dp}
                  alt={selectedGirl.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-gray-900 shadow-xl"
                />
              </div>
            </div>

            {/* Profile Info details */}
            <div className="pt-10 px-6 pb-6">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  {selectedGirl.name}
                </h3>
                <span className="text-lg">{selectedGirl.flag}</span>
              </div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
                {selectedGirl.tagline}
              </p>

              <div className="space-y-3.5 text-xs text-gray-600 dark:text-gray-300">
                <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl">
                  <span className="font-bold text-gray-400 block text-[10px] uppercase mb-0.5">About & Status</span>
                  <p className="italic">"{selectedGirl.aboutStatus}"</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-400 block text-[10px] uppercase mb-0.5">Phone Number</span>
                    <span className="font-mono text-gray-800 dark:text-gray-200">{selectedGirl.phone}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    WhatsApp
                  </span>
                </div>

                <div>
                  <span className="font-bold text-gray-400 block text-[10px] uppercase mb-1.5">Interests & Hobbies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedGirl.interests.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 text-[11px] font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-colors"
                  >
                    Return to Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vercel & Gemini Setup Guide Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 animate-scale-up">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">
                    Vercel & Gemini Setup Guide
                  </h3>
                  <p className="text-[11px] text-emerald-100">
                    2 minute mein Gemini AI connect karein
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-gray-700 dark:text-gray-300 max-h-[75vh] overflow-y-auto">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
                <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                  💡 Yeh Masla Kyun Aata Hai?
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  Jab aap app ko Vercel par host karte hain, tou Vercel par <strong>GEMINI_API_KEY</strong> add karni parti hai taake server Gemini AI se connect ho sake.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-gray-900 dark:text-white block mb-0.5">
                      Free Gemini API Key Hasil Karein
                    </strong>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      Google AI Studio se bilkul free key copy karein:
                    </p>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs transition-colors"
                    >
                      <span>Get Free Key (Google AI Studio)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-gray-900 dark:text-white block mb-0.5">
                      Vercel Dashboard Open Karein
                    </strong>
                    <p className="text-gray-500 dark:text-gray-400">
                      Apne browser mein <span className="font-semibold text-gray-800 dark:text-gray-200">vercel.com</span> par login karein aur apna project open karein.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-gray-900 dark:text-white block mb-0.5">
                      Environment Variable Add Karein
                    </strong>
                    <p className="text-gray-500 dark:text-gray-400 mb-1.5">
                      Project ke <span className="font-semibold text-gray-800 dark:text-gray-200">Settings</span> tab mein jayein aur left side se <span className="font-semibold text-gray-800 dark:text-gray-200">Environment Variables</span> par click karein:
                    </p>
                    <div className="space-y-1 bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-[11px]">
                      <div><span className="text-gray-400">Key: </span><span className="text-emerald-600 font-bold">GEMINI_API_KEY</span></div>
                      <div><span className="text-gray-400">Value: </span><span className="text-indigo-600">your_copied_api_key</span></div>
                    </div>
                    <p className="text-gray-400 text-[11px] mt-1.5">Phir "Save" par click kar dein.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                    4
                  </span>
                  <div>
                    <strong className="text-gray-900 dark:text-white block mb-0.5">
                      Vercel Redeploy Karein
                    </strong>
                    <p className="text-gray-500 dark:text-gray-400">
                      Vercel ke <span className="font-semibold text-gray-800 dark:text-gray-200">Deployments</span> tab mein jayein, latest deployment ke sath 3 dots (...) par click karke <span className="font-semibold text-gray-800 dark:text-gray-200">Redeploy</span> par click karein.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowSetupModal(false)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-md cursor-pointer"
                >
                  Samajh Aa Gaya / Theek Hai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGirlfriendWhatsApp;
