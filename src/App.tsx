import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, Heart, Moon, Sun, Loader2 } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const ToolPage = lazy(() => import('./pages/ToolPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  const location = useLocation();

  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolkit50_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Usage History State
  const [usageHistory, setUsageHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolkit50_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('toolkit50_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('toolkit50_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('toolkit50_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('toolkit50_history', JSON.stringify(usageHistory));
  }, [usageHistory]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans selection:bg-indigo-200 dark:selection:bg-indigo-900 transition-colors duration-200">
      {/* Fallback Helmet for overall site when not overridden by pages */}
      <Helmet>
        <title>50+ Free Daily SaaS Tools - Ultimate Utility Kit</title>
        <meta name="description" content="Access 50+ free daily use SaaS tools including text formatting, calculators, and developers utilities." />
      </Helmet>

      {/* Header - 3D Glassmorphism */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center cursor-pointer group"
            onClick={() => setShowFavoritesOnly(false)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-[0_4px_10px_rgba(99,102,241,0.5)] border border-white/20 transform group-hover:scale-105 transition-all">
              <Zap className="w-5 h-5 text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white tracking-tight leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">ToolKit50</h1>
              <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">Ultimate Utility</span>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link 
              to="/" 
              onClick={() => setShowFavoritesOnly(false)} 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!showFavoritesOnly && isHome ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-inner' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
            >
              All Tools
            </Link>
            <Link 
              to="/" 
              onClick={() => setShowFavoritesOnly(true)} 
              className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${showFavoritesOnly && isHome ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 shadow-inner' : 'text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'}`}
            >
              <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly && isHome ? 'fill-red-500 dark:fill-red-400' : ''}`} /> 
              Favorites
            </Link>
            <button 
              onClick={() => setIsDarkMode(prev => !prev)}
              title="Toggle Dark Mode"
              className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {isHome && (
          <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-800 py-16 text-center shadow-sm relative overflow-hidden transition-colors duration-200">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="max-w-4xl mx-auto px-4 relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight drop-shadow-sm">
                {showFavoritesOnly ? 'Your ' : 'Your daily '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400 drop-shadow-sm">
                  {showFavoritesOnly ? 'favorite tools.' : 'productivity toolkit.'}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-0 font-medium max-w-2xl mx-auto">
                {showFavoritesOnly 
                  ? "Quickly access your most-used utilities all in one place." 
                  : "A collection of 50+ fast, free, and local tools to help you with text, code, conversions, and more."}
              </p>
            </div>
          </div>
        )}

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-indigo-500 dark:text-indigo-400 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
          </div>
        }>
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                  showFavoritesOnly={showFavoritesOnly} 
                />
              } 
            />
            <Route 
              path="/tools/:slug" 
              element={
                <ToolPage 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                  usageHistory={usageHistory}
                  setUsageHistory={setUsageHistory}
                />
              } 
            />
            <Route 
              path="/category/:slug" 
              element={
                <CategoryPage 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                />
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm font-medium text-gray-400 dark:text-gray-500 mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] transition-colors duration-200">
        <p>© {new Date().getFullYear()} ToolKit50. Fast, secure, and runs in your browser.</p>
        <div className="flex justify-center gap-4 mt-4 text-indigo-500 dark:text-indigo-400">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-300">Home</Link>
          <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-300">Sitemap</a>
        </div>
      </footer>
    </div>
  );
}

