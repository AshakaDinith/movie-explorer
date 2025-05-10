import axios from 'axios';
import { MovieDetails, SearchResponse } from '../types';

// TMDb API configuration
const API_KEY = process.env.REACT_APP_TMDB_API_KEY || '24102b84497f0b058f54883e660e08e7'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// Get trending movies
export const getTrendingMovies = async (page = 1): Promise<SearchResponse> => {
  try {
    const response = await api.get('/trending/movie/week', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

// Search movies by query
export const searchMovies = async (query: string, page = 1): Promise<SearchResponse> => {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Get movie details by ID
export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  try {
    console.log(`Fetching details for movie ID: ${movieId}`);
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    // Re-throw error to be handled by the caller
    throw error;
  }
};

// Get movie poster URL
export const getImageUrl = (path: string, size = 'w500'): string => {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Get movie backdrop URL
export const getBackdropUrl = (path: string, size = 'original'): string => {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Get movies by genre
export const getMoviesByGenre = async (genreId: number, page = 1): Promise<SearchResponse> => {
  try {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

// Get all movie genres
export const getGenres = async () => {
  try {
    const response = await api.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

// Get filtered movies
export const getFilteredMovies = async (
  genreId: number | null = null,
  year: number | null = null,
  minRating: number = 0,
  page = 1
): Promise<SearchResponse> => {
  try {
    const params: any = {
      page,
      sort_by: 'popularity.desc',
      'vote_average.gte': minRating > 0 ? minRating : undefined,
    };

    if (genreId) {
      params.with_genres = genreId;
    }

    if (year) {
      params.primary_release_year = year;
    }

    const response = await api.get('/discover/movie', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered movies:', error);
    throw error;
  }
}; 