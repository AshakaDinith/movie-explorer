import React, { useState, useEffect } from 'react';
import { InputBase, IconButton, Paper, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../../contexts/MovieContext';

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, fetchMoviesBySearch } = useMovies();
  const [localQuery, setLocalQuery] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (localQuery.trim()) {
      setSearchQuery(localQuery);
      fetchMoviesBySearch(localQuery);
      navigate('/search');
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  return (
    <Box sx={{ flexGrow: { xs: 0.5, sm: 0.3 }, mx: { xs: 1, sm: 2 } }}>
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: 20,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Movies..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          inputProps={{ 'aria-label': 'search movies' }}
        />
        {localQuery && (
          <IconButton 
            sx={{ p: '10px' }} 
            aria-label="clear" 
            onClick={handleClear}
          >
            <ClearIcon />
          </IconButton>
        )}
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar; 