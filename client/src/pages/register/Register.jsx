import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import Navbar from "../../components/navbar/Navbar_for_Login.jsx";
import Subscribe from "../mailList/Subscribe";
import Footer from "../../components/footer/Footer";

const Register = () => {
    const [userData, setUserData] = useState({
        username:"",
        email: "",
        password:"",
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData((prev) => ({ ...prev, [e.target.id]: e.target.value}));
    };

    const handleRegister = async(e) => {
        e.preventDefault();
        try{
            await axios.post("/auth/register", userData);
            navigate("/login");
        }catch(err) {
            setError(err.response?.data?.message || "Registration Failed.");
        }
    };

    
}