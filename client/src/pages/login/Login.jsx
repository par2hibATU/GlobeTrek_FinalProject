import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import Navbar from "../../components/navbar/Navbar_for_Login.jsx";
import Subscribe from "../mailList/Subscribe";
import Footer from "../../components/footer/Footer";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();           //This handles the page refresh by the browser without filling in the form
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      console.log("Login Response:", res.data);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      console.log("Updated User in Context:", res.data);
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="background">
        <div className="login">
          <div className="lContainer">
            <input
              type="text"
              placeholder="username"
              id="username"
              onChange={handleChange}
              className="lInput"
            />
            <input
              type="password"
              placeholder="password"
              id="password"
              onChange={handleChange}
              className="lInput"
            />
            <button
              disabled={loading}
              onClick={handleClick}
              className="lButton"
            >
              Login
            </button>
            {error && <span>{error.message}</span>}
            <p className="registerText">
              Don't have an account? <a href="/register">Register</a>
            </p>
          </div>
        </div>
      </div>
      <Subscribe />
      <Footer />
    </div>
  );
};

export default Login;
