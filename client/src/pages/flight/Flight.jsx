import Reac, { useState } from "react";
import axios from "axios";
import "./flight.css";

const Flight = () => {
  const [apiChoice, setApiChoice] = useState("oneway"); // defaullt option
  const [query, setQuery] = useState({
    from: "",
    to: "",
    date: "",
    returnDate: "",
  });

  const [resuts, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const apiKey = "";

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    let endpoint = " ";

    try {
      const { from, to, date, returnDate } = formInputs;

      switch (apiChoice) {
        case "oneway":
          endpoint = ``;
          break;
        case "round":
          endpoint = ``;
          break;
        case "multi":
          endpoint = ``;
          break;
        case "tracking":
          endpoint = ``;
          break;
        case "schedule":
          endpoint = ``;
          break;
        case "airportcode":
          endpoint = ``;
          break;

        default:
          throw new Error("Invalid API type selected");
      }
      const res = await axios.get(endpoint);
      const data = res.data;

      setResults(data?.fares || data || []);
    } catch (err) {
      console.error("API error:", err);
      setErrorMsg("Could not fetch flight data. Try again later.");
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
          <option value="multi">Multi Trip (WIP)</option>
          <option value="tracking">Track a Flight</option>
          <option value="schedule">Airport Schedule</option>
          <option value="airportcode">Airport Code Lookup</option>
        </select>
        <form onSubmit={handleSubmit} className="searchForm">
          <input
            type="text"
            name="from"
            placeholder="From (e.g. JFK)"
            onChange={handleInput}
            required
          />
          <input
            type="text"
            name="to"
            placeholder="To (e.g. LHR)"
            onChange={handleInput}
            disabled={apiChoice === "airportcode"}
          />
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

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {errorMsg && <p className="error">{errorMsg}</p>}
      </div>
    </div>
  );
};
