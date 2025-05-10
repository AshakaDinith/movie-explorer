# Movie Explorer App

A web application that allows users to search for movies, view details, and discover trending films. The app fetches real-time data from the TMDb (The Movie Database) API.

## Features

- User login and registration
- Movie search functionality
- Display trending movies from TMDb API
- View detailed information about movies including cast, trailers, and ratings
- Add movies to favorites (for registered users)
- Light/dark mode toggle
- Responsive design for all device sizes

## Setup and Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository:
   ```
   git clone <repository-url>
   cd movie-explorer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a .env file in the root directory with your TMDb API key:
   ```
   REACT_APP_TMDB_API_KEY=your_api_key_here
   ```

   You can get a TMDb API key by signing up at [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup) and requesting an API key from your account settings.

4. Update the API key in the `src/services/api.ts` file:
   ```typescript
   const API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'YOUR_TMDB_API_KEY';
   ```

5. Start the development server:
   ```
   npm start
   ```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── common/        # Common components like Header, SearchBar, etc.
│   └── movie/         # Movie-specific components like MovieCard, etc.
├── contexts/          # React Context API for state management
├── hooks/             # Custom React hooks
├── pages/             # Application pages/routes
├── services/          # API services
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Technologies Used

- React 19
- TypeScript
- React Router for navigation
- Material-UI (MUI) for UI components
- Axios for API requests
- React Context API for state management
- Local Storage for data persistence

## API Integration

This application uses The Movie Database (TMDb) API to fetch movie data. The following endpoints are used:

- `/trending/movie/week` - Get trending movies
- `/search/movie` - Search for movies
- `/movie/{id}` - Get detailed movie information
- `/genre/movie/list` - Get movie genres
- `/discover/movie` - Discover movies by genre

## License

This project is licensed under the MIT License.
