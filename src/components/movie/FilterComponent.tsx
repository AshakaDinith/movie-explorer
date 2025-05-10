import React, { useEffect, useState } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Slider, 
  Grid, 
  Button,
  SelectChangeEvent,
  Paper
} from '@mui/material';
import { getGenres } from '../../services/api';
import { Genre } from '../../types';

interface FilterComponentProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  genreId: number | null;
  year: number | null;
  minRating: number;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilterChange }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Generate year options from 1940 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1939 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const genreData = await getGenres();
        setGenres(genreData);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    setSelectedGenre(value === 0 ? null : value);
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    setSelectedYear(value === 0 ? null : value);
  };

  const handleRatingChange = (_event: Event, newValue: number | number[]) => {
    setSelectedRating(newValue as number);
  };

  const handleApplyFilters = () => {
    onFilterChange({
      genreId: selectedGenre,
      year: selectedYear,
      minRating: selectedRating
    });
  };

  const handleResetFilters = () => {
    setSelectedGenre(null);
    setSelectedYear(null);
    setSelectedRating(0);
    
    onFilterChange({
      genreId: null,
      year: null,
      minRating: 0
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filter Movies
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="genre-select-label">Genre</InputLabel>
            <Select
              labelId="genre-select-label"
              id="genre-select"
              value={selectedGenre || 0}
              label="Genre"
              onChange={handleGenreChange}
              disabled={loading}
            >
              <MenuItem value={0}>All Genres</MenuItem>
              {genres.map(genre => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="year-select-label">Release Year</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear || 0}
              label="Release Year"
              onChange={handleYearChange}
            >
              <MenuItem value={0}>All Years</MenuItem>
              {years.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box sx={{ width: '100%', px: 2 }}>
            <Typography id="rating-slider-label" gutterBottom>
              Minimum Rating: {selectedRating}
            </Typography>
            <Slider
              aria-labelledby="rating-slider-label"
              value={selectedRating}
              onChange={handleRatingChange}
              valueLabelDisplay="auto"
              step={0.5}
              marks
              min={0}
              max={10}
            />
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handleResetFilters}
        >
          Reset
        </Button>
        <Button 
          variant="contained" 
          onClick={handleApplyFilters}
          color="primary"
        >
          Apply Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default FilterComponent; 