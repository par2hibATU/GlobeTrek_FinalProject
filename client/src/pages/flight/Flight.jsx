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
        
        switch (apiChoice){
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
    }catch (err){
        console.error("API error:", err);
        setErrorMsg("Could not fetch flight data. Try again later.");
    } finally {
        setLoading(false);
    }
  };

  return (
    
  )

};
