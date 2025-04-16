import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './currency.css';

const Currency = () => {
  const [quotes, setQuotes] = useState({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState(null);

  const API_URL = 'https://api.exchangerate.host/live';
  const API_KEY = 'ef6448b824a41a543b07855611f4aaad';

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get(API_URL, {
          params: {
            access_key: API_KEY,
            currencies: 'AUD,EUR,GBP,PLN,INR,CAD,JPY,CNY,CHF, HKD, SGD', 
          },
        });

        if (res.data && res.data.quotes) {
          setQuotes(res.data.quotes);
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchRates();
  }, []);



export default Currency;
