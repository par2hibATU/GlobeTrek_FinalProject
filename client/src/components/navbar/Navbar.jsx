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
    navigate("/")
  }
  return (
    <div className="navbar">

      <div className="navContainer">
        <Link to="/" style={{color:"inherit",textDecoration:"none"}}>
          <span className="logo">GlobeTrek</span>
        </Link>

        {user ? (
          <div className="userProfileSection">
            <div className="userIcon" onClick={() => setMenuOpen(!menuOpen)}>
              <FontAwesomeIcon icon={faUser} />
              <span style={{ marginLeft : "5px" }}>{user.username}</span>
            </div>
            {menuOpen && (
              <div className="dropdownMenu">
                <div className="dropdownItem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                >
                  Profile Dashboard
                  </div>
                  <div className="dropdownItem" onClick={handleLogout}>
                  Log Out
                </div>
              </div>
            )}
            </div>
        ) : (
        <div className="navbarRegisterItems">
          <button className="navButtonRegister"onClick={() => navigate("/register")}>Register</button>
          <button className="navButtonLogin" onClick={() => navigate("/login")}>Login</button>
        </div>
      )}

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
              <FontAwesomeIcon icon={faTaxi} />
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
              <span onClick={() => navigate("/currency")}>Currency Exchange</span>
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
