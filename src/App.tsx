import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, Heart, Download, Loader2 } from 'lucide-react';

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

  useEffect(() => {
    localStorage.setItem('toolkit50_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('toolkit50_history', JSON.stringify(usageHistory));
  }, [usageHistory]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleDownloadBackup = () => {
    const data = {
      favorites,
      usageHistory,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'toolkit50-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-indigo-200">
      {/* Fallback Helmet for overall site when not overridden by pages */}
      <Helmet>
        <title>50+ Free Daily SaaS Tools - Ultimate Utility Kit</title>
        <meta name="description" content="Access 50+ free daily use SaaS tools including text formatting, calculators, and developers utilities." />
      </Helmet>

      {/* Header - 3D Glassmorphism */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
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
              <h1 className="font-bold text-xl text-gray-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">ToolKit50</h1>
              <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Ultimate Utility</span>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link 
              to="/" 
              onClick={() => setShowFavoritesOnly(false)} 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!showFavoritesOnly && isHome ? 'bg-indigo-50 text-indigo-700 shadow-inner' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              All Tools
            </Link>
            <Link 
              to="/" 
              onClick={() => setShowFavoritesOnly(true)} 
              className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${showFavoritesOnly && isHome ? 'bg-red-50 text-red-600 shadow-inner' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}`}
            >
              <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly && isHome ? 'fill-red-500' : ''}`} /> 
              Favorites
            </Link>
            <button 
              onClick={handleDownloadBackup}
              title="Download Data Backup"
              className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {isHome && (
          <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-100 py-16 text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="max-w-4xl mx-auto px-4 relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight drop-shadow-sm">
                {showFavoritesOnly ? 'Your ' : 'Your daily '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 drop-shadow-sm">
                  {showFavoritesOnly ? 'favorite tools.' : 'productivity toolkit.'}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 mb-0 font-medium max-w-2xl mx-auto">
                {showFavoritesOnly 
                  ? "Quickly access your most-used utilities all in one place." 
                  : "A collection of 50+ fast, free, and local tools to help you with text, code, conversions, and more."}
              </p>
            </div>
          </div>
        )}

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading...</p>
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
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm font-medium text-gray-400 mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
        <p>© {new Date().getFullYear()} ToolKit50. Fast, secure, and runs in your browser.</p>
        <div className="flex justify-center gap-4 mt-4 text-indigo-500">
          <Link to="/">Home</Link>
          <a href="/sitemap.xml" target="_blank" rel="noreferrer">Sitemap</a>
        </div>
      </footer>
    </div>
  );
}

