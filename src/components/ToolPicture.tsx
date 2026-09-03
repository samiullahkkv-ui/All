import React, { useState } from 'react';
import { Tool } from '../types';
import { getToolImage } from '../utils/toolImages';
import { getToolIcon } from '../utils/toolIcons';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface ToolPictureProps {
  tool: Tool;
  variant?: 'banner' | 'card' | 'compact';
  className?: string;
  showCategoryBadge?: boolean;
}

export const ToolPicture: React.FC<ToolPictureProps> = ({
  tool,
  variant = 'card',
  className = '',
  showCategoryBadge = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getToolImage(tool.id, tool.category, tool.image);
  const Icon = getToolIcon(tool.id, tool.category, tool.icon);

  if (variant === 'banner') {
    return (
      <div 
        className={`relative w-full h-52 sm:h-64 md:h-72 rounded-3xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 bg-gray-900 group mb-8 ${className}`}
      >
        {!imageError ? (
          <img
            src={imageUrl}
            alt={`${tool.title} preview`}
            loading="eager"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center">
            <Icon className="w-20 h-20 text-indigo-400 opacity-40 animate-pulse" />
          </div>
        )}

        {/* Gradient overlays for contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/70 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none z-10">
          {showCategoryBadge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              {tool.category}
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-semibold shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Free & Secure
          </span>
        </div>

        {/* Bottom Title Info on Banner */}
        <div className="absolute bottom-5 left-6 right-6 z-10 pointer-events-none">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                {tool.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 line-clamp-1 opacity-90 max-w-xl">
                {tool.intro || tool.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div 
      className={`relative w-full h-40 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 flex-shrink-0 ${className}`}
    >
      {!imageError ? (
        <img
          src={imageUrl}
          alt={tool.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 dark:from-indigo-950/40 dark:to-purple-950/40 flex items-center justify-center">
          <Icon className="w-12 h-12 text-indigo-400 opacity-50" />
        </div>
      )}

      {/* Subtle bottom shadow gradient to elevate text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

      {/* Category Pill Tag on Card */}
      {showCategoryBadge && (
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-[11px] font-bold tracking-wide border border-white/20 shadow-sm">
            {tool.category}
          </span>
        </div>
      )}

      {/* Small floating icon circle bottom-right */}
      <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
        <div className="w-8 h-8 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-white/40 dark:border-gray-700">
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
