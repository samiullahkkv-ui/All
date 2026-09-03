import React from 'react';
import ToolGrid from '../components/ToolGrid';
import { tools } from '../toolsData';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ToolPicture } from '../components/ToolPicture';

interface HomeProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
}

export default function Home({ favorites, toggleFavorite, showFavoritesOnly }: HomeProps) {
  const aiTools = tools.filter(t => t.category === 'AI Tools');

  return (
    <>
      {!showFavoritesOnly && aiTools.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 pt-10 pb-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/30 text-white">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">AI Utilities</h2>
                <p className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400 mt-1">Next-generation smart tools powered by AI</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {aiTools.map(tool => {
              return (
                <Link
                  key={tool.id}
                  to={`/tools/${tool.id}`}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-5 flex flex-col items-start transition-all duration-300 border-2 border-transparent hover:border-indigo-500 dark:border-gray-800 dark:hover:border-indigo-400 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)] transform hover:-translate-y-1 group relative overflow-hidden box-border min-w-0 w-full"
                >
                  {/* Tool Picture on Top */}
                  <div className="w-full relative mb-4">
                    <ToolPicture tool={tool} variant="card" className="h-40" />
                  </div>
                  
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors relative z-10 w-full truncate break-words whitespace-normal">{tool.title}</h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-2 mb-5 relative z-10 w-full break-words">
                    {tool.description}
                  </p>
                  <div className="mt-auto flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-bold relative z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all transform sm:translate-y-2 sm:group-hover:translate-y-0 duration-300">
                    Open Tool <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="mt-12 mb-4 h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
        </div>
      )}
      
      <ToolGrid 
        favorites={favorites} 
        toggleFavorite={toggleFavorite} 
        showFavoritesOnly={showFavoritesOnly} 
      />
    </>
  );
}
