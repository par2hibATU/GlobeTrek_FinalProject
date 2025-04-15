import React, { useState } from "react";
import axios from "axios";
import "./flight.css";

const Flight = () => {
  const [apiChoice, setApiChoice] = useState("oneway");

  const [formInputs, setFormInputs] = useState({
    from: "",
    to: "",
    date: "",
    returnDate: "",
    cabinClass: "",
    currency: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const apiKey = "ca58f54fcfmshc9094c7708a82fdp13d1bajsn692a9dac2899"; 

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

    const {
      from,
      to,
      date,
      returnDate,
      cabinClass,
      currency,
    } = formInputs;

    let endpoint = "";

    try {
      // Build endpoint based on selected API type
      switch (apiChoice) {
        case "oneway":
          endpoint = `https://api.flightapi.io/onewaytrip/${apiKey}/${from}/${to}/${date}/1/0/0/${cabinClass}/${currency}`;
          break;

        case "round":
          endpoint = `https://api.flightapi.io/roundtrip/${apiKey}/${from}/${to}/${date}/${returnDate}/1/0/0/${cabinClass}/${currency}`;
          break;

        case "multi":
          endpoint = `https://api.flightapi.io/multitrip/${apiKey}?arp1=${from}&arp2=${to}&date1=${date}&adults=1&children=0&infants=0&cabinclass=${cabinClass}&currency=${currency}`;
          break;

        case "tracking":
          endpoint = `https://api.flightapi.io/airline/${apiKey}?num=33&name=DL&date=${date.replace(/-/g, "")}`;
          break;

        case "schedule":
          endpoint = `https://api.flightapi.io/schedule/${apiKey}?mode=departures&iata=${from}&day=1`;
          break;

        case "airportcode":
          endpoint = `https://api.flightapi.io/iata/${apiKey}?name=${from}&type=airport`;
          break;

        default:
          throw new Error("Unsupported API type selected.");
      }

      const res = await axios.get(endpoint);
      const data = res.data;

      setResults(data?.fares || data || []);
    } catch (err) {
      console.error("API Error:", err);
      setErrorMsg("Something went wrong. Please try again later.");
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
