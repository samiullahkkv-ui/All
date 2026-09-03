import React, { useState } from 'react';
import { tools } from '../toolsData';
import { ToolCategory } from '../types';
import { Search, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolPicture } from './ToolPicture';

interface ToolGridProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
}

export default function ToolGrid({ favorites, toggleFavorite, showFavoritesOnly }: ToolGridProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
  
  const categories: (ToolCategory | 'All')[] = ['All', 'AI Tools', 'Text Tools', 'Developer', 'Generators', 'Calculators', 'Converters', 'Media Tools', 'Document Tools', 'Web Tools'];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(search.toLowerCase()) || 
                          tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    const matchesFav = !showFavoritesOnly || favorites.includes(tool.id);
    return matchesSearch && matchesCategory && matchesFav;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Search and Filter */}
      {!showFavoritesOnly && (
        <div className="mb-10 space-y-6">
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all text-gray-900 dark:text-white placeholder-gray-400 text-lg outline-none box-border min-w-0"
              placeholder="Search for a tool (e.g. Word Counter)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] translate-y-[-2px]'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map(tool => {
          const Icon = tool.icon;
          const isFav = favorites.includes(tool.id);
          
          return (
            <Link
              key={tool.id}
              to={`/tools/${tool.id}`}
              className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-5 flex flex-col items-start transition-all duration-300 border-2 border-transparent hover:border-indigo-500 dark:border-gray-800 dark:hover:border-indigo-400 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)] transform hover:-translate-y-1 group relative overflow-hidden box-border min-w-0 w-full"
            >
              {/* Tool Picture on Top */}
              <div className="w-full relative mb-4">
                <ToolPicture tool={tool} variant="card" className="h-40" />
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(tool.id); }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 transition-colors z-20 shadow-sm"
                  title={isFav ? "Remove from favorites" : "Add to favorites"}
                  aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-400 group-hover:text-red-400'}`} />
                </button>
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

        {filteredTools.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center min-w-0">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No tools found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {showFavoritesOnly ? "You haven't added any favorites yet." : "Try adjusting your search or category filter."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
