import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_KEY = "5ae2e3f221c38a28845f05b6751b62017f6246199eff0252e90b1108";

const TouristPlaces = () => {
  const [city, setCity] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setPlaces([]);

    try {
      const geoRes = await axios.get(
        `https://api.opentripmap.com/0.1/en/places/geoname`,
        {
          params: {
            name: city,
            apikey: API_KEY,
          },
        }
      );

      const { lat, lon } = geoRes.data;

      const nearbyRes = await axios.get(
        `https://api.opentripmap.com/0.1/en/places/radius`,
        {
          params: {
            radius: 5000,
            lon,
            lat,
            kinds: "interesting_places",
            format: "json",
            limit: 50,
            apikey: API_KEY,
          },
        }
      );

      setPlaces(nearbyRes.data);
    } catch (err) {
      console.error(err);
      setError("Could not fetch tourist places. Try another location.");
    }

    setLoading(false);
  };

  const handleNavigateToMap = (place) => {
    const placeName = place.name || "Unnamed Place";
    navigate("/map", { state: { destination: placeName } });
  };

  return (
    <div className="travel-container">
      <h2>🌍 Find Nearby Travel Spots</h2>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city name (e.g., Galway)"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {places.map((place, index) => (
          <li
            key={index}
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => handleNavigateToMap(place)}
          >
            <strong>{place.name || "Unnamed Place"}</strong> - {place.kinds}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TouristPlaces;
