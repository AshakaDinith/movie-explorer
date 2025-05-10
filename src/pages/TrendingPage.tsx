import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useMovies } from '../contexts/MovieContext';
import MovieGrid from '../components/movie/MovieGrid';
import FilterComponent, { FilterValues } from '../components/movie/FilterComponent';

const TrendingPage: React.FC = () => {
  const { 
    trendingMovies,
    movies,
    loading, 
    error, 
    fetchTrendingMovies, 
    fetchFilteredMovies,
    totalPages, 
    currentPage,
    activeFilters,
    setActiveFilters 
  } = useMovies();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    // If no trending movies are loaded yet
    if (trendingMovies.length === 0 && !loading && !isFiltered) {
      fetchTrendingMovies(1);
    }
  }, [fetchTrendingMovies, trendingMovies.length, loading, isFiltered]);

  const handleLoadMore = async () => {
    if (currentPage < totalPages && !loading) {
      setIsLoadingMore(true);
      
      if (isFiltered && activeFilters) {
        await fetchFilteredMovies(activeFilters, currentPage + 1);
      } else {
        await fetchTrendingMovies(currentPage + 1);
      }
      
      setIsLoadingMore(false);
    }
  };

  const handleFilterChange = (filters: FilterValues) => {
    // Check if any filters are active
    const hasActiveFilters = 
      filters.genreId !== null || 
      filters.year !== null || 
      filters.minRating > 0;
    
    setIsFiltered(hasActiveFilters);
    
    if (hasActiveFilters) {
      fetchFilteredMovies(filters, 1);
    } else {
      setActiveFilters(null);
      fetchTrendingMovies(1);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ fontWeight: 'bold', mb: 3 }}
        >
          {isFiltered ? 'Filtered Movies' : 'Trending Movies'}
        </Typography>
        
        <FilterComponent onFilterChange={handleFilterChange} />
        
        {loading && (isFiltered ? true : trendingMovies.length === 0) ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <MovieGrid 
            movies={isFiltered ? movies : trendingMovies} 
            loading={isLoadingMore} 
            error={error}
            onLoadMore={handleLoadMore}
            hasMorePages={currentPage < totalPages}
          />
        )}
      </Box>
    </Container>
  );
};

export default TrendingPage; 