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

    try
  }

};
