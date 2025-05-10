import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Movie } from '../../types';

interface FavoriteButtonProps {
  movieId: number;
  movie?: Movie;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId, movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if movie is in favorites
    const favorites = localStorage.getItem('movie_explorer_favorites');
    if (favorites) {
      const favoriteMovies: Movie[] = JSON.parse(favorites);
      setIsFavorite(favoriteMovies.some(m => m.id === movieId));
    }
  }, [movieId]);

  const toggleFavorite = () => {
    try {
      const favorites = localStorage.getItem('movie_explorer_favorites');
      let favoriteMovies: Movie[] = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        // Remove from favorites
        favoriteMovies = favoriteMovies.filter(m => m.id !== movieId);
      } else if (movie) {
        // Add to favorites
        favoriteMovies.push(movie);
      }

      localStorage.setItem('movie_explorer_favorites', JSON.stringify(favoriteMovies));
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error updating favorites:', err);
    }
  };

  return (
    <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
      <IconButton 
        onClick={toggleFavorite}
        color="primary"
        sx={{ 
          '&:hover': { 
            transform: 'scale(1.1)',
            transition: 'transform 0.2s'
          }
        }}
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton; 