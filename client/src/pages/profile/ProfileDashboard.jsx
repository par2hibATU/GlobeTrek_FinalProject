import React, { useEffect, useState, useContext } from "react";
import "./profileDashboard.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import StarRating from "../../components/StarRating/StarRating";

const ProfileDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [ratingInput, setRatingInput] = useState({});
  const [commentInput, setCommentInput] = useState({});

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

  const handleRatingClick = (hotelId, value) => {
    setRatingInput((prev) => ({ ...prev, [hotelId]: value }));
  };

  const handleSubmitReview = async (hotelId) => {
    try {
      const rating = ratingInput[hotelId];
      const comment = commentInput[hotelId];
      if (!rating || !comment) return alert("Please provide both rating and comment");

      const res = await axios.post(
        `/reviews/${hotelId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Review submitted!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="profileDashboard">
      <h2>Welcome, {user.username}</h2>
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

              {/* Show current rating */}
              <div style={{ margin: "10px 0" }}>
                <strong>Average Rating:</strong>{" "}
                <StarRating rating={b.hotelId?.rating || 0} />
              </div>

              {/* Star rating selection */}
              <div className="starSelector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRatingClick(b.hotelId._id, star)}
                    style={{
                      fontSize: "24px",
                      cursor: "pointer",
                      color:
                        ratingInput[b.hotelId._id] >= star ? "#FFD700" : "#ccc",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Comment Box */}
              <textarea
                placeholder="Leave your comment..."
                value={commentInput[b.hotelId._id] || ""}
                onChange={(e) =>
                  setCommentInput((prev) => ({
                    ...prev,
                    [b.hotelId._id]: e.target.value,
                  }))
                }
              />

              <button
                className="submitReviewButton"
                onClick={() => handleSubmitReview(b.hotelId._id)}
              >
                Submit Review
              </button>
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
