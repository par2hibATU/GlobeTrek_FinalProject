import React, { useEffect, useState, useContext } from "react";
import "./profileDashboard.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const ProfileDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`/bookings/user/${user._id}`);
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchBookings();
  }, [user]);

  return (
    <div className="profileDashboard">
      <h2>Welcome, {user.username} </h2>
      <h3>Your Bookings</h3>
      <div className="bookingsList">
        {bookings.length > 0 ? (
          bookings.map((b, i) => (
            <div className="bookingCard" key={i}>
              <h4>Hotel: {b.hotelId?.name || b.hotelName}</h4>
              <p>Rooms: {b.roomNumbers.join(", ")}</p>
              <p>
                Dates: {new Date(b.dates[0]).toLocaleDateString()} -{" "}
                {new Date(b.dates[b.dates.length - 1]).toLocaleDateString()}
              </p>
              <p>Total Price: ${b.price}</p>
              <button className="payNowButton">Pay Now</button>
            </div>
          ))
        ) : (
          <p>No bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileDashboard;
