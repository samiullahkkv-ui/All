import React, { useState } from 'react';
import { tools } from '../toolsData';
import { ToolCategory } from '../types';
import { Search, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolGridProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
}

export default function ToolGrid({ favorites, toggleFavorite, showFavoritesOnly }: ToolGridProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');

  const categories: (ToolCategory | 'All')[] = ['All', 'Text Tools', 'Developer', 'Generators', 'Calculators', 'Converters', 'Media Tools', 'Document Tools', 'Web Tools'];

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
              className="block w-full pl-11 pr-4 py-4 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all text-gray-900 placeholder-gray-400 text-lg outline-none"
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
                    : 'bg-white text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3D Compact Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {filteredTools.map(tool => {
          const Icon = tool.icon;
          const isFav = favorites.includes(tool.id);
          
          return (
            <Link
              key={tool.id}
              to={`/tools/${tool.id}`}
              className="bg-white rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 border-b-4 border-gray-100 hover:border-indigo-500 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.5)] transform hover:-translate-y-2 cursor-pointer relative group"
            >
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(tool.id); }}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
                title={isFav ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-300 group-hover:text-red-300'}`} />
              </button>
              
              <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3 shadow-[0_10px_20px_-10px_rgba(99,102,241,0.8)] border-t border-white/40 transform group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-7 h-7 text-white drop-shadow-md" />
              </div>
              
              <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight">{tool.title}</h3>
              <p className="text-[11px] text-gray-500 line-clamp-2 leading-snug">
                {tool.description}
              </p>
            </Link>
          );
        })}
        {filteredTools.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No tools found</h3>
            <p className="text-gray-500">
              {showFavoritesOnly ? "You haven't added any favorites yet." : "Try adjusting your search or category filter."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
