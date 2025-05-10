import React from 'react';
import { Grid, Box, Typography, CircularProgress, Button } from '@mui/material';
import MovieCard from './MovieCard';
import { Movie } from '../../types';

interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  title?: string;
  onLoadMore?: () => void;
  hasMorePages?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading,
  error,
  title,
  onLoadMore,
  hasMorePages = false,
}) => {
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (loading && movies.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (movies.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h6">No movies found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      {title && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ px: { xs: 2, sm: 0 }, fontWeight: 'bold' }}>
          {title}
        </Typography>
      )}

      <Grid container spacing={3} sx={{ px: { xs: 2, sm: 0 } }}>
        {movies.map((movie) => (
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={movie.id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {onLoadMore && hasMorePages && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onLoadMore}
            sx={{ minWidth: 150 }}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MovieGrid; 