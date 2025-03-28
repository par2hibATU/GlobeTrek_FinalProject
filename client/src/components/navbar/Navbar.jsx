import React, { useContext } from "react";
import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faCar,
  faLocation,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";



export const Navbar = () => {
  const { user } = useContext(AuthContext);
  console.log("Navbar user:", user); // Debugging

  return (
    <div className="navbar">

      <div className="navContainer">
        <Link to="/" style={{color:"inherit",textDecoration:"none"}}>
          <span className="logo">GlobeTrek</span>
        </Link>

        {user ? user.username : (<div className="navbarRegisterItems">
          <button className="navButton">Register</button>
          <button className="navButton">Login</button>
        </div>)}

        <div className="navItems">
          <div className="navbarList">
            <div className="navbarListItem active">
              <FontAwesomeIcon icon={faBed} />
              <span>Stays</span>
            </div>

            <div className="navbarListItem">
              <FontAwesomeIcon icon={faPlane} />
              <span>Flights</span>
            </div>
            <div className="navbarListItem">
              <FontAwesomeIcon icon={faCar} />
              <span>Car rentals</span>
            </div>
            <div className="navbarListItem">
              <FontAwesomeIcon icon={faBed} />
              <span>Attraction</span>
            </div>
            <div className="navbarListItem">
              <FontAwesomeIcon icon={faTaxi} />
              <span>Airport Taxis</span>
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
