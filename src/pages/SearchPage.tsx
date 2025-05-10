import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Divider, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useMovies } from '../contexts/MovieContext';
import MovieGrid from '../components/movie/MovieGrid';
import FilterComponent, { FilterValues } from '../components/movie/FilterComponent';

const SearchPage: React.FC = () => {
  const { 
    movies, 
    loading, 
    error, 
    searchQuery, 
    fetchMoviesBySearch, 
    fetchFilteredMovies,
    totalPages, 
    currentPage,
    activeFilters,
    setActiveFilters,
    setSearchQuery
  } = useMovies();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Clear results when search query is empty
  useEffect(() => {
    if (!searchQuery && !isFiltered) {
      setActiveFilters(null);
    }
  }, [searchQuery, isFiltered, setActiveFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      fetchMoviesBySearch(localSearchQuery);
    }
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    setSearchQuery('');
  };

  const handleLoadMore = async () => {
    if (currentPage < totalPages && !loading) {
      setIsLoadingMore(true);
      
      if (isFiltered && activeFilters) {
        await fetchFilteredMovies(activeFilters, currentPage + 1);
      } else if (searchQuery) {
        await fetchMoviesBySearch(searchQuery, currentPage + 1);
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
    } else if (searchQuery) {
      setActiveFilters(null);
      fetchMoviesBySearch(searchQuery, 1);
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
          Search Movies
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for movies..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: localSearchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        {searchQuery && (
          <>
            <FilterComponent onFilterChange={handleFilterChange} />
            <Divider sx={{ my: 3 }} />
          </>
        )}
        
        {loading && movies.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : movies.length > 0 ? (
          <MovieGrid 
            movies={movies} 
            loading={isLoadingMore} 
            error={error}
            onLoadMore={handleLoadMore}
            hasMorePages={currentPage < totalPages}
          />
        ) : searchQuery ? (
          <Typography variant="h6" align="center" sx={{ py: 5 }}>
            No movies found for "{searchQuery}"
          </Typography>
        ) : (
          <Typography variant="h6" align="center" sx={{ py: 5 }}>
            Enter a search term to find movies
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default SearchPage; 