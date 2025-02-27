import "./hamburgerButton.css";
import React, { useState, handleMapClick, handleMapClick2, handleMapClick3 } from "react";
import { useNavigate } from "react-router-dom";
import { FloatButton } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faLocation, faMessage, faPlus } from "@fortawesome/free-solid-svg-icons";



export const HamburgerButton = () => {
  const navigate = useNavigate();

  const handleMapClick = () => {
    navigate("/map"); // Navigate to the map page
  };

  const handleMapClick2 = () => {
    navigate("/contact"); // Navigate to the map page
  };
  const handleMapClick3 = () => {
    navigate("/weather"); // Navigate to the map page
  };
  return (
    <div>

      <FloatButton.Group
        icon={<FontAwesomeIcon icon={faPlus} />}
        trigger="click"
      >
        <FloatButton
          icon={<FontAwesomeIcon icon={faMessage} />}
          tooltip="Contact us"
          onClick={handleMapClick2}
        />
        <FloatButton
          icon={<FontAwesomeIcon icon={faLocation} />}
          tooltip="Location"
          onClick={handleMapClick}
        />
        <FloatButton
          icon={<FontAwesomeIcon icon={faCloud} />}
          tooltip="Weather"
          onClick={handleMapClick3}
        />
      </FloatButton.Group>
    </div>
  );
};

export default HamburgerButton;
