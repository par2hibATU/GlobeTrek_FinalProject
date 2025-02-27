import React, { useState } from 'react'
import "./hotel.css"
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Subscribe from '../mailList/Subscribe';
import { text } from '@fortawesome/fontawesome-svg-core';

export const Hotel = () => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const photos = [
    {
      src: "https://www.theghotel.ie/wp-content/uploads/2019/11/exterior-13-1024x576.jpg"
    },
    {
      src: "https://www.theghotel.ie/wp-content/uploads/2020/09/Luxury-Room-1920x1080-fp_mm-fpoff_0_0.jpg"
    },
    {
      src: "https://www.theghotel.ie/wp-content/uploads/2021/09/The-Atrium-Suite-1440x720-fpoff__.jpg"
      
    },
    {
      src: "https://www.theghotel.ie/wp-content/uploads/2019/11/linda-evabgelista-bathroom-gallery-01-959x1024.jpg"
    },
    {
      src: "https://www.theghotel.ie/wp-content/uploads/2023/04/gRoom12-1024x683.jpg"
    },
    {
      src: "https://www.theghotel.ie/wp-content/uploads/2023/04/ghotelinteriorSession8756_HDR3-1024x683.jpg"
    }
  ]
const handleOpen = (i)=>{
  setSlideNumber(i);
  setOpen(true);
} 
const handleMove = (direction) =>{
  let newSlideNumber;
  if(direction=='l'){
    newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
  }else{
    newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
  }
  setSlideNumber(newSlideNumber)
};

  return (
    <div>
      <Navbar/>
      <div className="hotelContainer">
        {open && <div className="slider">
          <FontAwesomeIcon icon={faCircleXmark} className='close' onClick={()=>setOpen(false)}/>
          <FontAwesomeIcon icon={faCircleArrowLeft} className='arrow' onClick={()=>handleMove("l")}/>
          <div className="sliderWrapper">
            <img src={photos[slideNumber].src} alt="" className='sliderImg'/>
          </div>
          <FontAwesomeIcon icon={faCircleArrowRight} className='arrow' onClick={()=>handleMove("r")}/>
        </div>}
        <div className="hotelWrapper">
          <button className='bookNow'>Reserve or Book Now!</button>
          <h1 className='hotelTitle'>Grand Hotel</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot}/>
            <span>8 Quay Street, H91-EY78, Eyre Square, Galway</span>
          </div>
          <span className='hotelDistance'>
            Excellent Location - 500m from the center
          </span>
          <span className='hotelPriceHighlight'>
            Book your spot over £75 and Experience the absolute comfort. Get a free coach station Taxi pickup
          </span>
          <div className="hotelImages">
            {photos.map((photo, i) =>(
              <div className="hotelImgWrapper">
                <img onClick={()=>handleOpen(i)} src={photo.src} alt="" className='hotelImg'/>
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className='hotelTitle'>Stay in heart of Galway</h1>
              <p className='hotelDesc'>
              Fabulous is your natural habitat. Swaddled in five-star luxury. 
            Surrounded by exhilarating design. Steps away from a spirited city, where something wonderful waits around every corner. 
            Everything you see has been chosen to make you smile. Everyone you meet is waiting to make your day. 
            Whatever you were doing yesterday, today you’re a VIP. Because today, you’re at The g. For us, five stars has never been about formality. 
            We know the greatest luxury is getting to be yourself. In all your glory. We could go on and on (and on) about what a special hotel this is. 
              </p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a 9-night stay!</h1>
              <span>
              The g Hotel & Spa is in Galway, perched on the edge of Lough Atalia as you enter the heart of Galway City. 
              If you need anything (anything at all) just reach out. 
              You can call us any time at +353 91 865200, or drop us a line
              </span>
              <h2>
                <b>£75</b> (9 nights)
              </h2>
              <button>Reserve or Book now!</button>
            </div>
          </div>
        </div>
      </div>
      <Subscribe/>
      <Footer/>
    </div>
  )
}
export default Hotel;