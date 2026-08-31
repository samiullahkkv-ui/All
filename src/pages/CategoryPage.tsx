import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { tools } from '../toolsData';
import ToolGrid from '../components/ToolGrid';

interface CategoryPageProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function CategoryPage({ favorites, toggleFavorite }: CategoryPageProps) {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) return <Navigate to="/404" replace />;

  const categories = ['Text Tools', 'Developer', 'Generators', 'Calculators', 'Converters', 'Media Tools', 'Document Tools', 'Web Tools'];
  
  const categoryName = categories.find(c => c.toLowerCase().replace(/\s+/g, '-') === slug);

  if (!categoryName) {
    return <Navigate to="/404" replace />;
  }

  const categoryTools = tools.filter(t => t.category === categoryName);
  
  const seoTitle = `${categoryName} - Free Online Tools`;
  const seoDescription = `Discover our free online ${categoryName.toLowerCase()}. Fast, secure, and easy to use tools directly in your browser.`;
  const domain = window.location.origin;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": domain },
      { "@type": "ListItem", "position": 2, "name": categoryName, "item": `${domain}/category/${slug}` }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`${domain}/category/${slug}`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>→</span>
          <span className="text-gray-900 font-medium">{categoryName}</span>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{categoryName}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{seoDescription}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {categoryTools.map(tool => {
            const Icon = tool.icon;
            const isFav = favorites.includes(tool.id);
            return (
              <Link
                key={tool.id}
                to={`/tools/${tool.id}`}
                className="bg-white rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 border-b-4 border-gray-100 hover:border-indigo-500 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.5)] transform hover:-translate-y-2 cursor-pointer relative group"
              >
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
        </div>
      </div>
    </>
  );
}
