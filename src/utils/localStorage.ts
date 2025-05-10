import { User } from '../types';

// Keys for local storage
const USER_KEY = 'movie_explorer_user';
const THEME_KEY = 'movie_explorer_theme';
const LAST_SEARCH_KEY = 'movie_explorer_last_search';

// User functions
export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const clearUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Favorite movies functions
export const addFavoriteMovie = (movieId: number): void => {
  const user = getUser();
  if (user) {
    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      saveUser(user);
    }
  }
};

export const removeFavoriteMovie = (movieId: number): void => {
  const user = getUser();
  if (user) {
    user.favorites = user.favorites.filter(id => id !== movieId);
    saveUser(user);
  }
};

export const isFavoriteMovie = (movieId: number): boolean => {
  const user = getUser();
  return user ? user.favorites.includes(movieId) : false;
};

export const getFavoriteMovies = (): number[] => {
  const user = getUser();
  return user ? user.favorites : [];
};

// Theme functions
export const saveTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme);
};

export const getTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
};

// Last search functions
export const saveLastSearch = (query: string): void => {
  localStorage.setItem(LAST_SEARCH_KEY, query);
};

export const getLastSearch = (): string => {
  return localStorage.getItem(LAST_SEARCH_KEY) || '';
}; 