// src/pages/hotelDetails/HotelDetails.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import "./hotelDetails.css";
import Subscribe from "../mailList/Subscribe";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";


const HotelDetails = () => {
  const { id } = useParams();
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const { data, loading, error } = useFetch(`/hotels/find/${id}`);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? data.photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === data.photos.length - 1 ? 0 : slideNumber + 1;
    }
    setSlideNumber(newSlideNumber);
  };

  return (
    <div className="hotelDetails">
      {loading ? (
        <p>Loading hotel details...</p>
      ) : error ? (
        <p>Something went wrong!</p>
      ) : (
        <div className="hotelDetailsWrapper">
          {open && (
            <div className="slider">
              <span className="close" onClick={() => setOpen(false)}>&times;</span>
              <span className="arrow left" onClick={() => handleMove("l")}>&#10094;</span>
              <div className="sliderWrapper">
                <img src={data.photos[slideNumber]} alt="Hotel" className="sliderImg" />
              </div>
              <span className="arrow right" onClick={() => handleMove("r")}>&#10095;</span>
            </div>
          )}
          <h1 className="hotelTitle">{data.name}</h1>
          <div className="hotelAddress">
            <span>{data.address}</span>
          </div>
          <span className="hotelDistance">
            Excellent Location - {data.distance}m from the center
          </span>
          <span className="hotelPriceHighlight">
            Book your spot over €{data.cheapestPrice} and experience absolute comfort.
          </span>
          <div className="hotelImages">
            {data.photos?.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo}
                  alt="Hotel"
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetailsTexts">
            <h2 className="hotelTitle">{data.title}</h2>
            <p className="hotelDesc">{data.desc}</p>
          </div>
          <div className="hotelDetailsPrice">
            <h3>Starting from €{data.cheapestPrice}</h3>
            <p>🚫 Please select your travel dates and number of guests to proceed with booking.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
