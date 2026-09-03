import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { tools } from '../toolsData';
import ToolGrid from '../components/ToolGrid';
import { ToolPicture } from '../components/ToolPicture';

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
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>→</span>
          <span className="text-gray-900 dark:text-white font-medium">{categoryName}</span>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">{categoryName}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{seoDescription}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryTools.map(tool => {
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
                <div className="mt-auto flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-bold relative z-10">
                  Open Tool →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
