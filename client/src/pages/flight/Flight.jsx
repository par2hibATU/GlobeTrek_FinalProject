import React, { useState } from "react";
import axios from "axios";
import "./flight.css";

const airportData = {
  letterkenny: { name: "Letterkenny", iata: "LTR", lat: 54.94999, lng: -7.73332 },
  signature: { name: "Dublin Signature", iata: "DSA", lat: 53.42989, lng: -6.2454 },
  shannon: { name: "Shannon", iata: "SNN", lat: 52.69966, lng: -8.91469 },
  dublin: { name: "Dublin", iata: "DUB", lat: 52.69966, lng: -8.91469 },
  cork: { name: "Cork", iata: "ORK", lat: 51.84493, lng: -8.49279 }
};


const Flight = () => {
  const [apiChoice, setApiChoice] = useState("oneway");

  const [formInputs, setFormInputs] = useState({
    from: "",
    to: "",
    date: "",
    returnDate: "",
    cabinClass: "",
    currency: "",
    selectedAirport: ""
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const flightApiKey = "ca58f54fcfmshc9094c7708a82fdp13d1bajsn692a9dac2899"; 
  const rapidApiKey = "YOUR_RAPIDAPI_KEY";

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setResults([]);

    let endpoint = "";

    try {
      const {
        from,
        to,
        date,
        returnDate,
        cabinClass,
        currency,
        selectedAirport
      } = formInputs;

      if (apiChoice === "airportsLive") {
        const selectedIATA = airportData[selectedAirport].iata;
        endpoint = `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${selectedIATA}?offsetMinutes=-120&durationMinutes=720&withLeg=true&direction=Both&withCancelled=true&withCodeshared=true&withCargo=true&withPrivate=true&withLocation=false`;

        const res = await axios.get(endpoint, {
          headers: {
            "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
            "x-rapidapi-key": rapidApiKey
          }
        });

        setResults(res.data?.departures || res.data?.arrivals || []);
      } else {
        switch (apiChoice) {
          case "oneway":
            endpoint = `https://api.flightapi.io/onewaytrip/${flightApiKey}/${from}/${to}/${date}/1/0/0/${cabinClass}/${currency}`;
            break;
          case "round":
            endpoint = `https://api.flightapi.io/roundtrip/${flightApiKey}/${from}/${to}/${date}/${returnDate}/1/0/0/${cabinClass}/${currency}`;
            break;
          default:
            throw new Error("Unsupported API type.");
        }

        const res = await axios.get(endpoint);
        setResults(res.data?.fares || []);
      }
    } catch (err) {
      console.error("API error:", err);
      setErrorMsg("Could not fetch flight data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flightWrapper">
      <div className="searchBox">
        <h2>Flight Finder</h2>

        <select
          value={apiChoice}
          onChange={(e) => setApiChoice(e.target.value)}
          className="dropdown"
        >
          <option value="oneway">One-way Trip</option>
          <option value="round">Round Trip</option>
          <option value="multi">Multi Trip</option>
          <option value="tracking">Track a Flight</option>
          <option value="schedule">Airport Schedule</option>
          <option value="airportcode">Airport Code Lookup</option>
        </select>

        <form onSubmit={handleSubmit} className="searchForm">
          <input
            type="text"
            name="from"
            placeholder="From (IATA)"
            onChange={handleInput}
            required
          />

          {apiChoice !== "airportcode" && (
            <input
              type="text"
              name="to"
              placeholder="To (IATA)"
              onChange={handleInput}
              required
            />
          )}

          <input
            type="date"
            name="date"
            onChange={handleInput}
            required
          />

          {apiChoice === "round" && (
            <input
              type="date"
              name="returnDate"
              onChange={handleInput}
              required
            />
          )}

          {(apiChoice === "oneway" || apiChoice === "round" || apiChoice === "multi") && (
            <>
              <select
                name="cabinClass"
                onChange={handleInput}
                required
              >
                <option value="">Cabin Class</option>
                <option value="Economy">Economy</option>
                <option value="PremiumEconomy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First">First</option>
              </select>

              <select
                name="currency"
                onChange={handleInput}
                required
              >
                <option value="">Currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="INR">INR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
              </select>
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {errorMsg && <p className="error">{errorMsg}</p>}
      </div>

      <div className="resultsBox">
        {results.length > 0 ? (
          results.map((item, idx) => (
            <div key={idx} className="resultCard">
              <pre>{JSON.stringify(item, null, 2)}</pre>
            </div>
          ))
        ) : (
          !loading && <p className="noResults">No results to display.</p>
        )}
      </div>
    </div>
  );
};

export default Flight;
