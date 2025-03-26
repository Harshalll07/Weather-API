import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const API_KEY = '8ab35961f4f5fa7868f278327a142004';

  const fetchWeather = async (location) => {
    try {
      setLoading(true);
      setError('');
      let url;
      
      if (typeof location === 'string') {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      setWeather(data);
      setCity(data.name);
      setIsFlipped(false); // Reset flip when new data loads
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (err) => {
          setError('Geolocation access denied. Please search by city.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const toggleFlip = () => {
    if (weather) {
      setIsFlipped(!isFlipped);
    }
  };

  useEffect(() => {
    // Optional: Fetch weather for a default city on initial load
    // fetchWeather('London');
  }, []);

  return (
    <div className="app">
      <div className={`weather-container ${isFlipped ? 'flipped' : ''}`} onClick={toggleFlip}>
        <div className="weather-card-inner">
          {/* Front of the card */}
          <div className="weather-card-front">
            <h1>Weather App</h1>
            
            <form onSubmit={handleSubmit} className="search-form" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
              />
              <div className="button-group">
                <button type="submit">Search</button>
                <button type="button" onClick={getLocationWeather} className="location-btn">
                  Use My Location
                </button>
              </div>
            </form>

            {loading && <p className="loading">Loading weather data...</p>}
            
            {error && <p className="error">{error}</p>}
            
            {weather && (
              <div className="weather-info">
                <h2>{weather.name}, {weather.sys.country}</h2>
                <div className="weather-main">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    alt={weather.weather[0].description}
                    className="weather-icon"
                  />
                  <div className="temp">{Math.round(weather.main.temp)}°C</div>
                </div>
                <p className="description">{weather.weather[0].description}</p>
                <p className="flip-hint">Click card for details →</p>
              </div>
            )}
          </div>

          {/* Back of the card */}
          {weather && (
            <div className="weather-card-back">
              <h2>Weather Details</h2>
              <div className="weather-details-grid">
                <div className="detail-card">
                  <span className="detail-label">Feels Like</span>
                  <span className="detail-value">{Math.round(weather.main.feels_like)}°C</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Humidity</span>
                  <span className="detail-value">{weather.main.humidity}%</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Wind</span>
                  <span className="detail-value">{weather.wind.speed} m/s</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Pressure</span>
                  <span className="detail-value">{weather.main.pressure} hPa</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Min Temp</span>
                  <span className="detail-value">{Math.round(weather.main.temp_min)}°C</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Max Temp</span>
                  <span className="detail-value">{Math.round(weather.main.temp_max)}°C</span>
                </div>
              </div>
              <p className="flip-hint">← Click to return</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;