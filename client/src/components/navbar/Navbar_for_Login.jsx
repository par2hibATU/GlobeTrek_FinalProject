import React, { useContext, useState } from "react";
import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faCar,
  faCoins,
  faLocation,
  faPlane,
  faTaxi,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const Navbar = () => {
  const navigate = useNavigate();

  const { user, dispatch } = useContext(AuthContext);
  console.log("Navbar user:", user); // Debugging
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">GlobeTrek</span>
        </Link>

        <div className="navItems">
          <div className="navbarList">
            <div className="navbarListItem">
              <FontAwesomeIcon icon={faBed} />
              <span onClick={() => navigate("/")}>Stays</span>
            </div>

            <div className="navbarListItem">
              <FontAwesomeIcon icon={faPlane} />
              <span onClick={() => navigate("/flight")}>Flights</span>
            </div>
            <div className="navbarListItem">
              <FontAwesomeIcon icon={faCar} />
              <a
                href="https://www.free-now.com/ie/"
                target="_blank"
                rel="noopener noreferrer"
                
              >
                Taxi
              </a>
            </div>
            <div className="navbarListItem">
              <FontAwesomeIcon icon={faBed} />
              <span onClick={() => navigate("/touristPlaces")}>Attraction</span>
            </div>
            <div className="navbarListItem">
              <FontAwesomeIcon icon={faCoins} />
              <span onClick={() => navigate("/currency")}>
                Currency Exchange
              </span>
            </div>
            <div className="navbarListItem">
              <FontAwesomeIcon icon={faLocation} />
              <span>Your location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
