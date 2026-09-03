import React from 'react';
import ToolGrid from '../components/ToolGrid';

interface HomeProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
}

export default function Home({ favorites, toggleFavorite, showFavoritesOnly }: HomeProps) {
  return (
    <ToolGrid 
      favorites={favorites} 
      toggleFavorite={toggleFavorite} 
      showFavoritesOnly={showFavoritesOnly} 
    />
  );
}
