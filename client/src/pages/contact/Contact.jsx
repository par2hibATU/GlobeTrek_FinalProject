import React, { useState } from 'react';

export const Contact = () => {
  // State to manage form inputs
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Handle input changes
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
    // You can now submit the form data to an API or perform other actions
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="name@example.com"
          value={email}
          onChange={handleEmailChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          Message
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          value={message}
          onChange={handleMessageChange}
        ></textarea>
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default Contact;
