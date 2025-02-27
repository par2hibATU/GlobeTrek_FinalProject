import React, { useState, useEffect, useRef } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer, InfoWindowF } from '@react-google-maps/api'

const loaderOptions = {
  id: 'google-map-script',
  googleMapsApiKey: 'AIzaSyDZ7REbIrwpLU151WlyKLKdr6j4Y9qd7Ec',
  libraries: ['places'], // Ensure all necessary libraries are included here
}

const containerStyle = {
  width: '1800px',
  height: '900px',
}

const weatherApiKey = 'f00c38e0279b7bc85480c3fe775d518c' // OpenWeatherMap API Key

function Map() {
  const { isLoaded } = useJsApiLoader(loaderOptions)

  const [map, setMap] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [weatherData, setWeatherData] = useState(null) // To store weather data
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const inputRef = useRef(null)

  // Get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCurrentLocation(location)
          fetchWeather(location) // Fetch weather once location is determined
        },
        (error) => {
          console.error('Error fetching location:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  // Fetch weather data for a specific location
  //metric means the temperature will be in celcius, wind speed in meters per second. imperial means in Fahrenheit and miles per hour.
  const fetchWeather = async (location) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${weatherApiKey}&units=metric`
    try {
      const response = await fetch(weatherUrl)
      const data = await response.json()
      if (response.ok) {
        setWeatherData(data) // Save weather data
      } else {
        console.error('Failed to fetch weather:', data.message)
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
  }

  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const handleSearch = () => {
    const directionsService = new window.google.maps.DirectionsService()
    const origin = currentLocation
    const destination = inputRef.current.value

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirectionsResponse(result)
        } else {
          console.error(`Directions request failed due to ${status}`)
        }
      }
    )
  }

  return isLoaded && currentLocation ? (
    <div>
      {/* Search Box */}
      <div style={{ marginBottom: '10px' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter a destination"
          style={{
            width: '300px',
            height: '40px',
            marginRight: '10px',
            fontSize: '16px',
            padding: '5px',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            height: '40px',
            padding: '5px 15px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      {/* Weather Info */}
      {weatherData && (
        <div style={{ marginBottom: '10px', fontSize: '18px' }}>
          <h3>Weather in {weatherData.name}</h3>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="Weather Icon"
            style={{ height: '50px' }}
          />
        </div>
      )}

      {/* Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Marker at Current Location */}
        <MarkerF position={currentLocation}>
          {/* InfoWindow to display weather on the map */}
          {weatherData && (
            <InfoWindowF position={currentLocation}>
              <div>
                <h4>{weatherData.name}</h4>
                <p>{weatherData.main.temp}°C</p>
                <p>{weatherData.weather[0].description}</p>
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt="Weather Icon"
                  style={{ height: '30px' }}
                />
              </div>
            </InfoWindowF>
          )}
        </MarkerF>

        {/* Directions Renderer */}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
    </div>
  ) : (
    <div>Loading map or fetching location...</div>
  )
}

export default React.memo(Map)
