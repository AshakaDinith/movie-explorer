import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Rating,
  Divider,
  Stack,
  Avatar,
  Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useMovies } from '../contexts/MovieContext';
import { getBackdropUrl, getImageUrl } from '../services/api';
import FavoriteButton from '../components/movie/FavoriteButton';

const MovieDetail: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { selectedMovie, loading, error, fetchMovieDetails, clearSelectedMovie } = useMovies();
  const navigate = useNavigate();
  const unmountedRef = useRef(false);

  useEffect(() => {
    // Only fetch if movieId exists and is valid
    if (movieId && !isNaN(parseInt(movieId, 10))) {
      fetchMovieDetails(parseInt(movieId, 10));
    }
    
    // Cleanup function
    return () => {
      unmountedRef.current = true;
      // No need to call clearSelectedMovie here - it's causing the infinite loop
    };
  }, [movieId, fetchMovieDetails]);

  const handleBack = () => {
    navigate(-1);
  };

  const getTrailerId = React.useCallback((): string | null => {
    if (!selectedMovie?.videos?.results.length) return null;
    
    // Try to find a YouTube trailer
    const trailer = selectedMovie.videos.results.find(
      (video) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
    );
    
    if (trailer) {
      return trailer.key;
    }
    
    return null;
  }, [selectedMovie?.videos]);

  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Compute these values once per render to avoid repeated calculations
  const trailerId = React.useMemo(() => getTrailerId(), [getTrailerId]);
  const trailerUrl = trailerId ? `https://www.youtube.com/watch?v=${trailerId}` : null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  if (!selectedMovie) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Movie not found
          </Typography>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      {/* Backdrop Image */}
      <Box
        sx={{
          height: { xs: '300px', md: '500px' },
          width: '100%',
          position: 'relative',
          mb: { xs: 2, md: 0 },
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
            backgroundImage: `url(${getBackdropUrl(selectedMovie.backdrop_path)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))',
            },
          }}
        />

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          variant="contained"
          color="primary"
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 2,
          }}
        >
          Back
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 0, md: -6 }, position: 'relative', zIndex: 2 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Movie Poster */}
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Box
                component="img"
                sx={{
                  width: '100%',
                  borderRadius: 1,
                  boxShadow: 3,
                }}
                alt={selectedMovie.title}
                src={getImageUrl(selectedMovie.poster_path)}
              />
            </Grid>

            {/* Movie Info */}
            <Grid size={{ xs: 12, sm: 8, md: 9 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                  {selectedMovie.title} ({selectedMovie.release_date.split('-')[0]})
                </Typography>
                <FavoriteButton movieId={selectedMovie.id} />
              </Box>

              {selectedMovie.tagline && (
                <Typography variant="subtitle1" color="text.secondary" gutterBottom fontStyle="italic">
                  "{selectedMovie.tagline}"
                </Typography>
              )}

              <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                {selectedMovie.genres.map((genre) => (
                  <Chip key={genre.id} label={genre.name} size="small" />
                ))}
              </Stack>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={selectedMovie.vote_average / 2} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {selectedMovie.vote_average.toFixed(1)}/10 ({selectedMovie.vote_count} votes)
                </Typography>
              </Box>

              <Typography variant="body1" gutterBottom>
                {selectedMovie.runtime > 0 && `${formatRuntime(selectedMovie.runtime)} • `}
                {selectedMovie.release_date}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedMovie.overview || 'No overview available.'}
              </Typography>

              {!trailerId && trailerUrl && (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PlayArrowIcon />}
                  component={Link}
                  href={trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 1 }}
                >
                  Watch Trailer
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Trailer Section */}
        {trailerId && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Trailer
            </Typography>
            <Box
              sx={{
                position: 'relative',
                paddingBottom: '56.25%', // 16:9 aspect ratio
                height: 0,
                overflow: 'hidden',
                width: '100%',
                borderRadius: 1,
              }}
            >
              <Box
                component="iframe"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
                src={`https://www.youtube.com/embed/${trailerId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          </Paper>
        )}

        {/* Cast Section */}
        {selectedMovie.credits?.cast && selectedMovie.credits.cast.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Top Cast
            </Typography>
            <Grid container spacing={2}>
              {selectedMovie.credits.cast.slice(0, 6).map((person) => (
                <Grid size={{ xs: 6, sm: 4, md: 2 }} key={person.id}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Avatar
                      src={person.profile_path ? getImageUrl(person.profile_path, 'w200') : undefined}
                      alt={person.name}
                      sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
                    />
                    <Typography variant="body1" noWrap fontWeight="bold">
                      {person.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {person.character}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MovieDetail; 