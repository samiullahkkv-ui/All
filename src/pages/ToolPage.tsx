import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { tools } from '../toolsData';
import ToolView from '../components/ToolView';
import { ToolPicture } from '../components/ToolPicture';

interface ToolPageProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  usageHistory: string[];
  setUsageHistory: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ToolPage({ favorites, toggleFavorite, usageHistory, setUsageHistory }: ToolPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const tool = tools.find(t => t.id === slug);

  if (!tool) {
    return <Navigate to="/404" replace />;
  }

  // Record usage history
  React.useEffect(() => {
    setUsageHistory(prev => {
      const newHist = [tool.id, ...prev.filter(id => id !== tool.id)].slice(0, 50);
      return newHist;
    });
  }, [tool.id, setUsageHistory]);

  const isFavorite = favorites.includes(tool.id);
  const domain = window.location.origin;

  // Find related tools (same category, excluding self)
  const relatedTools = tool.relatedTools 
    ? tool.relatedTools.map(id => tools.find(t => t.id === id)).filter(Boolean) as any[]
    : tools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 6);

  // SEO Info fallback
  const seoTitle = tool.seoTitle || `${tool.title} - Free Online ${tool.title}`;
  const seoDescription = tool.seoDescription || `Free online ${tool.title.toLowerCase()}. ${tool.description} Fast, secure, and easy to use.`;
  const h1 = tool.h1 || tool.title;
  const intro = tool.intro || `Welcome to our free online ${tool.title.toLowerCase()}. ${tool.description}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.title,
    "url": `${domain}/tools/${tool.id}`,
    "description": seoDescription,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": domain },
      { "@type": "ListItem", "position": 2, "name": tool.category, "item": `${domain}/category/${tool.category.toLowerCase().replace(/\s+/g, '-')}` },
      { "@type": "ListItem", "position": 3, "name": tool.title, "item": `${domain}/tools/${tool.id}` }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`${domain}/tools/${tool.id}`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={`${domain}/tools/${tool.id}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
          <span>→</span>
          <Link to={`/category/${tool.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{tool.category}</Link>
          <span>→</span>
          <span className="text-gray-900 dark:text-gray-200 font-medium">{tool.title}</span>
        </nav>

        {/* H1 and Intro */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">{h1}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{intro}</p>
        </div>

        {/* Tool Preview Picture Banner */}
        <ToolPicture tool={tool} variant="banner" />

        {/* The Actual Tool */}
        <ToolView 
          tool={tool} 
          isFavorite={isFavorite}
          onToggleFavorite={() => toggleFavorite(tool.id)}
        />

        {/* Content Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What is {tool.title}?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {tool.description} Whether you are a professional or just need a quick utility, our free online {tool.title.toLowerCase()} provides accurate and instant results directly in your browser. No installation or registration is required. We prioritize your privacy by processing data locally whenever technically possible.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use {tool.title}</h3>
          <ul className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300 mb-8">
            <li>Open the {tool.title} page.</li>
            <li>Input your required values or text into the designated fields.</li>
            <li>Click the action button or let it calculate automatically.</li>
            <li>View or copy your results instantly.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Features</h3>
          <ul className="list-disc list-inside space-y-3 text-gray-600 dark:text-gray-300 mb-8">
            <li>Fast and accurate results.</li>
            <li>Completely free to use.</li>
            <li>Mobile-friendly and responsive design.</li>
            <li>No data sent to servers (runs locally in your browser).</li>
          </ul>

          {tool.faq && tool.faq.length > 0 && (
            <>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4 mb-8">
                {tool.faq.map((q, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-5 rounded-2xl transition-colors duration-200">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{q.question}</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{q.answer}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Related Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {relatedTools.map(t => {
                return (
                  <Link
                    key={t.id}
                    to={`/tools/${t.id}`}
                    className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all flex flex-col group overflow-hidden"
                  >
                    <ToolPicture tool={t} variant="card" className="h-28 mb-3" showCategoryBadge={false} />
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{t.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{t.category}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
