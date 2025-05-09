import React, { useContext, useEffect, useState } from "react";
import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Subscribe from "../mailList/Subscribe";
import { text } from "@fortawesome/fontawesome-svg-core";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";

export const Hotel = () => {
  const location = useLocation();
  // console.log(location)
  const id = location.pathname.split("/")[2]; //it [2] cause remember the URL (/hotels/id), so hotelId is in pos 2
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false)
  const { data, loading, error } = useFetch(`/hotels/find/${id}`);
  const {user} = useContext(AuthContext)
  const navigate = useNavigate()
  const { dates, options } = useContext(SearchContext);

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }


  const days = dates.length > 0 
  ? dayDifference(dates[0].endDate, dates[0].startDate) 
  : 0;
  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };
  const handleMove = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }
    setSlideNumber(newSlideNumber);
  };

  const handleClick = () =>{
    if(user){
      setOpenModal(true)
    }else{
      navigate("/login")
      return alert("Please login to make a booking!!");
    }
  }
  return (
    <div>
      <Navbar />
      {loading ? (
        "loading"
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <img
                  src={data.photos[slideNumber]}
                  alt=""
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <button className="bookNow" onClick={handleClick}>Reserve now</button>
            <h1 className="hotelTitle">{data.name}</h1>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.address}</span>
            </div>
            <span className="hotelDistance">
              Excellent Location - {data.distance}m from the center
            </span>
            <span className="hotelPriceHighlight">
              Book your spot over €{data.cheapestPrice} and Experience the
              absolute comfort. Get a free coach station Taxi pickup
            </span>
            <div className="hotelImages">
              {data.photos?.map((photo, i) => (
                <div className="hotelImgWrapper">
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data.title}</h1>
                <p className="hotelDesc">{data.desc}</p>
              </div>
              <div className="hotelDetailsPrice">
                <h1>Perfect for a {days}-night stay!</h1>
                <span>
                  The g Hotel & Spa is in Galway, perched on the edge of Lough
                  Atalia as you enter the heart of Galway City. If you need
                  anything (anything at all) just reach out. You can call us any
                  time at +353 91 865200, or drop us a line
                </span>
                <h2>
                  
                  <b>${days * data.cheapestPrice * options.room}</b> ( {days}{" "}
                  nights)
                </h2>
                <button onClick={handleClick}>Book now!</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Subscribe />
      <Footer />

      {openModal && <Reserve setOpen={setOpenModal} hotelId={id}/>}
    </div>
  );
};
export default Hotel;
