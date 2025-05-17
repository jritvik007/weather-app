import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from './weatherSlice';
import { addSearch } from './historySlice';

const Weather = () => {
  const [city, setCity] = useState('');
  const dispatch = useDispatch();

  const weather = useSelector((state) => state.weather.data);
  const status = useSelector((state) => state.weather.status);
  const error = useSelector((state) => state.weather.error);
  const history = useSelector((state) => state.history);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city) {
      dispatch(fetchWeather(city));
      dispatch(addSearch(city));
      setCity('');
    }
  };

  const formatTime = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, padding: '16px' }}>
      <Box display="flex" justifyContent="center" mb={4}>
        <Typography variant="h3" color="primary" fontWeight="bold" gutterBottom>
          🌦️ Weather App
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSearch} display="flex" gap={2} mb={3}>
        <TextField
          label="Enter city name"
          variant="outlined"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<SearchIcon />}
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
        >
          Search
        </Button>
      </Box>

      {history.length > 0 && (
        <Box mb={3}>
          <Typography variant="subtitle1" color="textSecondary" mb={2}>
            Search History:
          </Typography>
          <List dense>
            {history.slice(0, 5).map((item, index) => (
              <ListItem
                key={index}
                button
                onClick={() => dispatch(fetchWeather(item))}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {status === 'loading' && (
        <Box display="flex" justifyContent="center" mb={3}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {/* Error Message */}
      {status === 'failed' && (
        <Typography color="error" align="center" variant="h6" mb={3}>
          Error: {error}
        </Typography>
      )}

      {/* Weather Details */}
      {weather && status === 'succeeded' && (
        <>
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                {weather.city?.name || weather.name},{' '}
                {weather.city?.country || weather.sys.country}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" color="textPrimary">
                    <ThermostatIcon sx={{ fontSize: 30, verticalAlign: 'middle', mr: 1 }} />
                    {weather.list ? weather.list[0].main.temp : weather.main.temp}°C
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {weather.list
                      ? weather.list[0].weather[0].description
                      : weather.weather[0].description}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Humidity: {weather.list ? weather.list[0].main.humidity : weather.main.humidity}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Wind: {weather.list ? weather.list[0].wind.speed : weather.wind.speed} m/s
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Sunrise: {formatTime(weather.sys.sunrise)} | Sunset: {formatTime(weather.sys.sunset)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {weather.list && (
            <Box>
              <Typography variant="h6" color="textPrimary" gutterBottom>
                5-Day Forecast:
              </Typography>
              <Grid container spacing={2}>
                {weather.list
                  .filter((_, index) => index % 8 === 0)
                  .map((day, index) => (
                    <Grid item xs={6} sm={4} md={2} key={index}>
                      <Card sx={{ boxShadow: 2 }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(day.dt * 1000).toLocaleDateString()}
                          </Typography>
                          <img
                            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                            alt={day.weather[0].description}
                          />
                          <Typography variant="body1" color="textPrimary" fontWeight="bold">
                            {Math.round(day.main.temp)}°C
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Weather;
