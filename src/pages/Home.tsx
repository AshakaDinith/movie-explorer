import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../contexts/MovieContext';
import MovieGrid from '../components/movie/MovieGrid';

const Home: React.FC = () => {
  const { trendingMovies, loading, error, fetchTrendingMovies } = useMovies();
  const [displayCount, setDisplayCount] = useState(6); // Initially display only 6 trending movies
  const navigate = useNavigate();

  useEffect(() => {
    // Load trending movies if not already loaded
    if (trendingMovies.length === 0 && !loading) {
      fetchTrendingMovies();
    }
  }, [fetchTrendingMovies, trendingMovies.length, loading]);

  const handleViewAllTrending = () => {
    navigate('/trending');
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Hero Section */}
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(https://source.unsplash.com/random?movie,cinema)`,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,.6)',
            }}
          />
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
              Discover Your Favorite Movies
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              Search for movies, explore trending titles, and create your own collection of favorites.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/trending')}
              sx={{ width: { xs: '100%', sm: 'auto' }, mt: 2, alignSelf: { sm: 'flex-start' } }}
            >
              Explore Movies
            </Button>
          </Box>
        </Paper>

        {/* Trending Movies Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', m: 0 }}>
              Trending Movies
            </Typography>
            <Button color="primary" onClick={handleViewAllTrending}>
              View All
            </Button>
          </Box>
          
          <MovieGrid 
            movies={trendingMovies.slice(0, displayCount)} 
            loading={loading} 
            error={error}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 