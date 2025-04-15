import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar_for_Login.jsx";
import Subscribe from "../mailList/Subscribe";
import Footer from "../../components/footer/Footer";
import "./flight.css";

const airportData = {
  shannon: { name: "Shannon", iata: "SNN", lat: 52.69966, lng: -8.91469 },
  dublin: { name: "Dublin", iata: "DUB", lat: 52.69966, lng: -8.91469 },
  cork: { name: "Cork", iata: "ORK", lat: 51.84493, lng: -8.49279 },
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
    selectedAirport: "dublin",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const flightApiKey = "ca58f54fcfmshc9094c7708a82fdp13d1bajsn692a9dac2899";
  const rapidApiKey = "ca58f54fcfmshc9094c7708a82fdp13d1bajsn692a9dac2899";

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  const formatTime = (timeObj) => {
    if (typeof timeObj === "object" && timeObj?.local) {
      return new Date(timeObj.local).toLocaleString();
    }
    return "-";
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
        selectedAirport,
      } = formInputs;

      if (apiChoice === "airportsLive") {
        const selectedIATA = airportData[selectedAirport]?.iata;
        endpoint = `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${selectedIATA}?offsetMinutes=-120&durationMinutes=720&withLeg=true&direction=Both&withCancelled=true&withCodeshared=true&withCargo=true&withPrivate=true&withLocation=false`;

        const res = await axios.get(endpoint, {
          headers: {
            "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
            "x-rapidapi-key": rapidApiKey,
          },
        });

        setResults([
          ...(res.data?.departures || []),
          ...(res.data?.arrivals || []),
        ]);
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

  const getDepartureAirport = (flight) => {
    return (
      (typeof flight?.departure?.airport === "object"
        ? flight?.departure?.airport?.name
        : flight?.departure?.airport) ||
      flight?.departureAirport?.name ||
      flight?.departure?.airportName ||
      airportData[formInputs.selectedAirport]?.name ||
      "Unknown"
    );
  };

  const getArrivalAirport = (flight) => {
    return (
      (typeof flight?.arrival?.airport === "object"
        ? flight?.arrival?.airport?.name
        : flight?.arrival?.airport) ||
      flight?.arrivalAirport?.name ||
      flight?.arrival?.airportName ||
      airportData[formInputs.selectedAirport]?.name ||
      "Unknown"
    );
  };

  return (
    <div>
      <Navbar />
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
            <option value="airportsLive">Live Flights at Irish Airports</option>
          </select>

          <form onSubmit={handleSubmit} className="searchForm">
            {(apiChoice === "oneway" || apiChoice === "round") && (
              <>
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
                  required
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
                <select
                  name="cabinClass"
                  onChange={handleInput}
                  defaultValue="ECONOMY"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First</option>
                </select>

                <select
                  name="currency"
                  onChange={handleInput}
                  defaultValue="USD"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </>
            )}

            {apiChoice === "airportsLive" && (
              <select
                name="selectedAirport"
                value={formInputs.selectedAirport}
                onChange={(e) =>
                  setFormInputs((prev) => ({
                    ...prev,
                    selectedAirport: e.target.value,
                  }))
                }
              >
                {Object.entries(airportData).map(([key, airport]) => (
                  <option key={key} value={key}>
                    {airport.name}
                  </option>
                ))}
              </select>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {errorMsg && <p className="error">{errorMsg}</p>}
        </div>

        {/* FLIGHT RESULTS */}
        <div className="resultsSplitContainer">
          {/* Departed Flights */}
          <div className="resultsColumn">
            <h3>🛫 Departed Flights</h3>
            {results
              .filter(
                (item) => (item.status || "").toLowerCase() === "departed"
              )
              .map((item, idx) => {
                const flight =
                  item.departure && item.arrival ? item : item.legs?.[0];
                return (
                  <div key={idx} className="resultCard departed">
                    <h4>
                      {item.airline?.name || flight?.airline?.name || "Airline"}
                    </h4>
                    <p>
                      <strong>Flight:</strong> {item.number || flight?.number}
                    </p>
                    <p>
                      <strong>From:</strong> {getDepartureAirport(flight)}{" "}
                      <span className="time">
                        ({formatTime(flight?.departure?.scheduledTime)})
                      </span>
                    </p>
                    <p>
                      <strong>To:</strong> {getArrivalAirport(flight)}{" "}
                      <span className="time">
                        ({formatTime(flight?.arrival?.scheduledTime)})
                      </span>
                    </p>
                    <p>
                      <strong>Status:</strong> {item.status}
                    </p>
                  </div>
                );
              })}
          </div>

          {/* Expected Flights */}
          <div className="resultsColumn">
            <h3>⏳ Expected Flights</h3>
            {results
              .filter(
                (item) => (item.status || "").toLowerCase() !== "departed"
              )
              .map((item, idx) => {
                const flight =
                  item.departure && item.arrival ? item : item.legs?.[0];
                return (
                  <div key={idx} className="resultCard expected">
                    <h4>
                      {item.airline?.name || flight?.airline?.name || "Airline"}
                    </h4>
                    <p>
                      <strong>Flight:</strong> {item.number || flight?.number}
                    </p>
                    <p>
                      <strong>From:</strong> {getArrivalAirport(flight)}{" "}
                      <span className="time">
                        ({formatTime(flight?.departure?.scheduledTime)})
                      </span>
                    </p>
                    <p>
                      <strong>To:</strong>{" "}
                      {airportData[formInputs.selectedAirport]?.name ||
                        "Unknown"}{" "}
                      <span className="time">
                        ({formatTime(flight?.arrival?.scheduledTime)})
                      </span>
                    </p>
                    <p>
                      <strong>Status:</strong> {item.status || "Expected"}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>

        {!loading && results.length === 0 && (
          <p className="noResults">No results to show.</p>
        )}
      </div>
      <Subscribe />
      <Footer />
    </div>
  );
};

export default Flight;
