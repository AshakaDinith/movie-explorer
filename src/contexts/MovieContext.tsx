import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Movie, MovieDetails } from '../types';
import { 
  getTrendingMovies, 
  searchMovies, 
  getMovieDetails, 
  getMoviesByGenre,
  getFilteredMovies 
} from '../services/api';
import { getLastSearch, saveLastSearch } from '../utils/localStorage';
import { FilterValues } from '../components/movie/FilterComponent';

interface MovieContextType {
  movies: Movie[];
  trendingMovies: Movie[];
  selectedMovie: MovieDetails | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  totalPages: number;
  currentPage: number;
  activeFilters: FilterValues | null;
  fetchTrendingMovies: (page?: number) => Promise<void>;
  fetchMoviesBySearch: (query: string, page?: number) => Promise<void>;
  fetchMovieDetails: (movieId: number) => Promise<void>;
  fetchMoviesByGenre: (genreId: number, page?: number) => Promise<void>;
  fetchFilteredMovies: (filters: FilterValues, page?: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  clearSelectedMovie: () => void;
  setActiveFilters: (filters: FilterValues | null) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovies = (): MovieContextType => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);
  const [currentMovieId, setCurrentMovieId] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    // Load trending movies on initial render
    fetchTrendingMovies();

    // Load last search from localStorage
    const lastSearch = getLastSearch();
    if (lastSearch) {
      setSearchQuery(lastSearch);
      fetchMoviesBySearch(lastSearch);
    }
  }, []);

  const fetchTrendingMovies = async (page = 1): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTrendingMovies(page);
      
      if (page === 1) {
        setTrendingMovies(response.results);
      } else {
        setTrendingMovies(prev => [...prev, ...response.results]);
      }
      
      setTotalPages(response.total_pages);
      setCurrentPage(response.page);
    } catch (err) {
      setError('Failed to fetch trending movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesBySearch = async (query: string, page = 1): Promise<void> => {
    if (!query.trim()) {
      setMovies([]);
      setTotalPages(1);
      setCurrentPage(1);
      setSearchQuery('');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      saveLastSearch(query);
      const response = await searchMovies(query, page);
      
      if (page === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setTotalPages(response.total_pages);
      setCurrentPage(response.page);
      setSearchQuery('');
    } catch (err) {
      setError('Failed to search movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async (movieId: number): Promise<void> => {
    // Skip fetch if we're already loading this movie
    if (loading && currentMovieId === movieId) {
      return;
    }
    
    // Skip fetch if we already have this movie's details loaded
    if (selectedMovie && selectedMovie.id === movieId) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setCurrentMovieId(movieId);
      const movieDetails = await getMovieDetails(movieId);
      setSelectedMovie(movieDetails);
    } catch (err) {
      setError('Failed to fetch movie details');
      console.error(err);
    } finally {
      setLoading(false);
      setCurrentMovieId(null);
    }
  };

  const fetchMoviesByGenre = async (genreId: number, page = 1): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMoviesByGenre(genreId, page);
      setMovies(response.results);
      setTotalPages(response.total_pages);
      setCurrentPage(response.page);
    } catch (err) {
      setError('Failed to fetch movies by genre');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredMovies = async (filters: FilterValues, page = 1): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const { genreId, year, minRating } = filters;
      const response = await getFilteredMovies(genreId, year, minRating, page);
      
      if (page === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setTotalPages(response.total_pages);
      setCurrentPage(response.page);
      setActiveFilters(filters);
    } catch (err) {
      setError('Failed to fetch filtered movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedMovie = useCallback(() => {
    if (!isClearing && selectedMovie !== null) {
      setIsClearing(true);
      setSelectedMovie(null);
      setIsClearing(false);
    }
  }, [selectedMovie, isClearing]);

  const value = {
    movies,
    trendingMovies,
    selectedMovie,
    loading,
    error,
    searchQuery,
    totalPages,
    currentPage,
    activeFilters,
    fetchTrendingMovies,
    fetchMoviesBySearch,
    fetchMovieDetails,
    fetchMoviesByGenre,
    fetchFilteredMovies,
    setSearchQuery,
    clearSelectedMovie,
    setActiveFilters,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}; 