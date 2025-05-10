import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useMovies } from '../contexts/MovieContext';
import MovieGrid from '../components/movie/MovieGrid';
import { Movie } from '../types';

const FavoritesPage: React.FC = () => {
  const { loading, error } = useMovies();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get favorites from localStorage
    const loadFavorites = () => {
      try {
        const favorites = localStorage.getItem('movie_explorer_favorites');
        if (favorites) {
          setFavoriteMovies(JSON.parse(favorites));
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ fontWeight: 'bold', mb: 3 }}
        >
          My Favorite Movies
        </Typography>

        {favoriteMovies.length > 0 ? (
          <MovieGrid 
            movies={favoriteMovies}
            loading={loading}
            error={error}
            onLoadMore={() => {}}
            hasMorePages={false}
          />
        ) : (
          <Typography variant="h6" align="center" sx={{ py: 5 }}>
            You haven't added any movies to your favorites yet.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default FavoritesPage; 