import React, { useState, useEffect } from "react";
import moment from "moment";
import './weather.css';


const WeatherApp = () => {
  const [city, setCity] = useState("Galway");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const url = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = "f00c38e0279b7bc85480c3fe775d518c";

  // Fetch weather data when the component mounts or when the city changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const tempUrl = `${url}?q=${city}&appid=${apiKey}&units=metric`;
        const res = await fetch(tempUrl);
        const data = await res.json();

        if (res.ok) {
          setWeatherData(data);
          setError(null); // Clear any previous errors
        } else {
          setError("City not found. Please try again.");
          setWeatherData(null);
        }
      } catch (fetchError) {
        setError("Error fetching weather data. Please try again later.");
        console.error("Error fetching weather data:", fetchError);
      }
    };

    fetchWeatherData();
  }, [city]);

  // Handle city input change
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter city name"
        style={{
          padding: "10px",
          fontSize: "16px",
          marginBottom: "10px",
          display: "block",
        }}
      />
      <button
        onClick={() => setCity(city)} // Trigger the city change explicitly
        style={{
          padding: "10px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      >
        Get Weather
      </button>

      {/* Display error messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display weather data */}
      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>{moment().format("MMMM Do YYYY, h:mm:ss a")}</p>
          <p>
            <strong>Temperature:</strong> {weatherData.main.temp}°C
          </p>
          <p>
            <strong>Description:</strong> {weatherData.weather[0].description}
          </p>
          <p>
            <strong>Wind Speed:</strong> {weatherData.wind.speed} m/s
          </p>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
