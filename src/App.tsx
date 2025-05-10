import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MovieProvider, useMovies } from './contexts/MovieContext';

// Components
import Header from './components/common/Header';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetail from './pages/MovieDetail';
import TrendingPage from './pages/TrendingPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import { Box } from '@mui/material';

// Protected Route Component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const isAuthenticated = localStorage.getItem('movie_explorer_user') !== null;
  
  return isAuthenticated ? (
    <>{element}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Public Route Component (for login and register)
const PublicRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const isAuthenticated = localStorage.getItem('movie_explorer_user') !== null;
  
  return isAuthenticated ? (
    <Navigate to="/" replace />
  ) : (
    <>{element}</>
  );
};

// Route listener component to clear selected movie when navigating away from movie detail
const RouteListener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { clearSelectedMovie } = useMovies();
  
  useEffect(() => {
    // Only clear when navigating away from movie detail page
    if (!location.pathname.includes('/movie/')) {
      clearSelectedMovie();
    }
  }, [location.pathname, clearSelectedMovie]);
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <RouteListener>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/movie/:movieId" element={<ProtectedRoute element={<MovieDetail />} />} />
        <Route path="/trending" element={<ProtectedRoute element={<TrendingPage />} />} />
        <Route path="/search" element={<ProtectedRoute element={<SearchPage />} />} />
        <Route 
          path="/favorites" 
          element={<ProtectedRoute element={<FavoritesPage />} />}
        />
        <Route 
          path="/profile" 
          element={<ProtectedRoute element={<div>Profile Page</div>} />}
        />
        
        {/* Catch all route - redirect to home if authenticated, login if not */}
        <Route path="*" element={
          localStorage.getItem('movie_explorer_user') ? 
            <Navigate to="/" replace /> : 
            <Navigate to="/login" replace />
        } />
      </Routes>
    </RouteListener>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <MovieProvider>
            <Box 
              sx={{ 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Header />
              <Box sx={{ flexGrow: 1 }}>
                <AppRoutes />
              </Box>
            </Box>
          </MovieProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
