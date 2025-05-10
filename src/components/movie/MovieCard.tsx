import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActionArea, Box, Rating, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../services/api';
import { Movie } from '../../types';
import FavoriteButton from './FavoriteButton';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
  
  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      elevation={3}
    >
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          height="300"
          image={getImageUrl(movie.poster_path) || 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={movie.title}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 1,
          }}
        >
          <Chip
            label={movie.vote_average.toFixed(1)}
            color={movie.vote_average >= 7 ? 'success' : movie.vote_average >= 5 ? 'warning' : 'error'}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
      </CardActionArea>
      
      <CardContent sx={{ flexGrow: 1, pt: 1, pb: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {releaseYear}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Rating
            value={movie.vote_average / 2}
            precision={0.5}
            size="small"
            readOnly
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({movie.vote_count})
          </Typography>
        </Box>
      </CardContent>
      
      <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
        <FavoriteButton movieId={movie.id} movie={movie} />
      </Box>
    </Card>
  );
};

export default MovieCard; 