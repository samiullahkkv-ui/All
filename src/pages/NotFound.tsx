import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 Not Found - Tool Not Found</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
          <Search className="w-12 h-12 text-gray-300" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 max-w-lg mb-8">
          The tool or page you are looking for doesn't exist or has been moved. 
          Use the search bar on our homepage to find what you need.
        </p>
        <Link 
          to="/" 
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-extrabold hover:bg-indigo-700 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-1"
        >
          Go Back Home
        </Link>
      </div>
    </>
  );
}
