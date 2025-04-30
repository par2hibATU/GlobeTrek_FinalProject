import React, { useState, useEffect, useRef } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  DirectionsRenderer,
  InfoWindowF
} from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
import "./map.css"

const loaderOptions = {
  id: 'google-map-script',
  googleMapsApiKey: 'AIzaSyBO1cpAgfDyQhGTeBh4MN4kYjRt7jbZ0ys',
  libraries: ['places'],
};

const containerStyle = {
  width: '100%',
  height: '100%',
};


const weatherApiKey = 'f00c38e0279b7bc85480c3fe775d518c'; // OpenWeatherMap API Key

function Map() {
  const { isLoaded } = useJsApiLoader(loaderOptions);
  const location = useLocation();
  const destinationCoords = location.state?.destinationCoords;
  const touristPlaces = location.state?.touristPlaces || [];

  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const inputRef = useRef(null);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          fetchWeather(location);
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Fetch weather from OpenWeatherMap
  const fetchWeather = async (location) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${weatherApiKey}&units=metric`;
    try {
      const response = await fetch(weatherUrl);
      const data = await response.json();
      if (response.ok) {
        setWeatherData(data);
      } else {
        console.error('Weather fetch failed:', data.message);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  // If destination is passed, auto route
  useEffect(() => {
    if (isLoaded && currentLocation && destinationCoords) {
      handleRouteToCoords(destinationCoords);
    }
  }, [currentLocation, destinationCoords]);

  const handleRouteToCoords = (coords) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: currentLocation,
        destination: coords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirectionsResponse(result);
        } else {
          console.error(`Route failed: ${status}`);
        }
      }
    );
  };

  const handleSearch = () => {
    const destination = inputRef.current.value;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: currentLocation,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirectionsResponse(result);
        } else {
          console.error(`Search route failed: ${status}`);
        }
      }
    );
  };

  const onLoad = React.useCallback(map => setMap(map), []);
  const onUnmount = React.useCallback(() => setMap(null), []);

  return isLoaded && currentLocation ? (
    <div className="map-wrapper">
      <div className="search-controls">
        <input ref={inputRef} type="text" placeholder="Enter a destination" />
        <button onClick={handleSearch}>Search</button>
      </div>
  
      {weatherData && (
        <div className="weather-card">
          <h3>Weather in {weatherData.name}</h3>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />
        </div>
      )}
  
  <div className="map-container">
  <GoogleMap
    mapContainerStyle={{ width: "100%", height: "100%" }} 
    center={currentLocation}
    zoom={14}
    onLoad={onLoad}
    onUnmount={onUnmount}
  >
    {/* Marker at Current Location */}
    <MarkerF position={currentLocation}>
      {weatherData && (
        <InfoWindowF position={currentLocation}>
          <div>
            <h4>{weatherData.name}</h4>
            <p>{weatherData.main.temp}°C</p>
            <p>{weatherData.weather[0].description}</p>
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="Weather Icon"
              style={{ height: "30px" }}
            />
          </div>
        </InfoWindowF>
      )}
    </MarkerF>

    {/* Tourist Place Markers */}
    {touristPlaces.map((place, idx) => (
      <MarkerF
        key={idx}
        position={{ lat: place.point.lat, lng: place.point.lon }}
        onClick={() => setSelectedPlace(place)}
      />
    ))}

    {/* Selected Place Info */}
    {selectedPlace && (
      <InfoWindowF
        position={{
          lat: selectedPlace.point.lat,
          lng: selectedPlace.point.lon,
        }}
        onCloseClick={() => setSelectedPlace(null)}
      >
        <div>
          <strong>{selectedPlace.name || "Unnamed Place"}</strong>
          <p>{selectedPlace.kinds}</p>
        </div>
      </InfoWindowF>
    )}

    {/* Route Directions */}
    {directionsResponse && (
      <DirectionsRenderer directions={directionsResponse} />
    )}
  </GoogleMap>
</div>

    </div>
  ) : (
    <div className="loading-message">Loading map or fetching location...</div>
  );
  
}

export default React.memo(Map);
