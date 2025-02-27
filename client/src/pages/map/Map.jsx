import React, { useState, useEffect, useRef } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer } from '@react-google-maps/api'

const loaderOptions = {
  id: 'google-map-script',
  googleMapsApiKey: 'AIzaSyDZ7REbIrwpLU151WlyKLKdr6j4Y9qd7Ec',
  libraries: ['places'], // Ensure all necessary libraries are included here
}

const containerStyle = {
  width: '1800px',
  height: '900px',
}

function Map() {
  const { isLoaded } = useJsApiLoader(loaderOptions)

  const [map, setMap] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error fetching location:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

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

      {/* Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Marker at Current Location */}
        <MarkerF position={currentLocation} />

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
