import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar_for_Login.jsx";
import Subscribe from "../mailList/Subscribe";
import Footer from "../../components/footer/Footer";
import "./currency.css";

const Currency = () => {
  const [quotes, setQuotes] = useState({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);

  const API_URL = "https://api.exchangerate.host/live";
  const API_KEY = "ef6448b824a41a543b07855611f4aaad";

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get(API_URL, {
          params: {
            access_key: API_KEY,
            currencies: "AUD,EUR,GBP,PLN,INR,CAD,JPY,CNY,CHF, HKD, SGD",
          },
        });

        if (res.data && res.data.quotes) {
          setQuotes(res.data.quotes);
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchRates();
  }, []);

  useEffect(() => {
    if (fromCurrency === "USD" && quotes[`USD${toCurrency}`]) {
      const rate = quotes[`USD${toCurrency}`];
      setConvertedAmount((amount * rate).toFixed(2));
    } else if (fromCurrency !== "USD" && toCurrency !== "USD") {
      const fromRate = quotes[`USD${fromCurrency}`];
      const toRate = quotes[`USD${toCurrency}`];
      if (fromRate && toRate) {
        const rate = toRate / fromRate;
        setConvertedAmount((amount * rate).toFixed(2));
      }
    } else if (fromCurrency !== "USD" && toCurrency === "USD") {
      const fromRate = quotes[`USD${fromCurrency}`];
      if (fromRate) {
        setConvertedAmount((amount / fromRate).toFixed(2));
      }
    }
  }, [amount, fromCurrency, toCurrency, quotes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "amount":
        setAmount(value);
        break;
      case "fromCurrency":
        setFromCurrency(value);
        break;
      case "toCurrency":
        setToCurrency(value);
        break;
      default:
        break;
    }
  };

  const supportedCurrencies = Object.keys(quotes).map((key) =>
    key.replace("USD", "")
  );

  return (
    <div>
      <Navbar />
      <div className="currency-card">
        <h1 className="currency-title">Currency Converter</h1>

        <div className="currency-exchange">
          <div className="currency-input-group">
            <label className="currency-label">Amount:</label>
            <input
              type="number"
              name="amount"
              className="currency-input"
              value={amount}
              onChange={handleChange}
            />
          </div>

          <div className="currency-input-group">
            <label className="currency-label">From Currency:</label>
            <select
              name="fromCurrency"
              value={fromCurrency}
              onChange={handleChange}
              className="currency-select"
            >
              {supportedCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
              <option value="USD">USD</option>
            </select>
          </div>

          <div className="currency-input-group">
            <label className="currency-label">To Currency:</label>
            <select
              name="toCurrency"
              value={toCurrency}
              onChange={handleChange}
              className="currency-select"
            >
              {supportedCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div className="currency-output">
          <h2>Converted Amount: {convertedAmount}</h2>
        </div>
      </div>

      <Subscribe />
      <Footer />
    </div>
  );
};

export default Currency;
