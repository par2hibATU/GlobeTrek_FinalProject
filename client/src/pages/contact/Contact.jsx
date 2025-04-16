import React, { useState } from 'react';
import "./contact.css"
import Navbar from "../../components/navbar/Navbar.jsx";
import Subscribe from "../mailList/Subscribe";
import Footer from "../../components/footer/Footer";

export const Contact = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Optional: handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Message:', message);
  };

  return (
    <div>
      <Navbar />
      <div className="contact-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="exampleFormControlInput1">Email address</label>
            <input
              type="email"
              id="exampleFormControlInput1"
              placeholder="name@example.com"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
    
          <div className="form-group">
            <label htmlFor="exampleFormControlTextarea1">Message</label>
            <textarea
              id="exampleFormControlTextarea1"
              rows="3"
              value={message}
              onChange={handleMessageChange}
            ></textarea>
          </div>
    
          <button type="submit" >Submit</button>
        </form>
      </div>
      <Subscribe />
      <Footer />
    </div>
  );
  
};

export default Contact;
