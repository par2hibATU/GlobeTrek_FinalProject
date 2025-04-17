import React, { useEffect, useState, useContext } from "react";
import "./profileDashboard.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import StarRating from "../../components/StarRating/StarRating";
import Navbar from "../../components/navbar/Navbar.jsx";
import Subscribe from "../mailList/Subscribe";
import Footer from "../../components/footer/Footer";

const ProfileDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [ratingInput, setRatingInput] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [reviewedBookings, setReviewedBookings] = useState(new Set());

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`/bookings/user/${user._id}`);
        console.log("Fetched bookings:", res.data);

        setBookings(res.data);

        // Optional: If backend supports a reviewed flag
        const reviewed = res.data
          .filter((b) => b.reviewed) // assuming backend returns this
          .map((b) => b._id);
        setReviewedBookings(new Set(reviewed));
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchBookings();
  }, [user]);

  const handleRatingClick = (bookingId, value) => {
    setRatingInput((prev) => ({ ...prev, [bookingId]: value }));
  };

  const handleSubmitReview = async (bookingId, hotelId) => {
    try {
      const rating = ratingInput[bookingId];
      const comment = commentInput[bookingId];
      if (!rating || !comment)
        return alert("Please provide both rating and comment");

      await axios.post(
        `/reviews/${hotelId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert("Review submitted!");

      // Mark as reviewed locally
      setReviewedBookings((prev) => new Set(prev).add(bookingId));
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="profileDashboard">
        <h2>Welcome, {user.username}</h2>
        <h3>Your Bookings</h3>
        <div className="bookingsList">
          {bookings.length > 0 ? (
            bookings.map((b, i) => (
              <div className="bookingCard" key={b._id || i}>
                <h4>Hotel: {b.hotelId?.name || b.hotelName}</h4>
                <p>Rooms: {b.resolvedRoomNumbers?.join(", ") || "N/A"}</p>

                <p>
                  Dates: {new Date(b.dates[0]).toLocaleDateString()} -{" "}
                  {new Date(b.dates[b.dates.length - 1]).toLocaleDateString()}
                </p>
                <p>Total Price: ${b.price}</p>

                {/* Show current average rating */}
                <div style={{ margin: "10px 0" }}>
                  <strong>Average Rating:</strong>{" "}
                  <StarRating rating={b.hotelId?.rating || 0} />
                </div>

                {/* Review Form or Thank You message */}
                {!reviewedBookings.has(b._id) ? (
                  <>
                    <div className="starSelector">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => handleRatingClick(b._id, star)}
                          style={{
                            fontSize: "24px",
                            cursor: "pointer",
                            color:
                              ratingInput[b._id] >= star ? "#FFD700" : "#ccc",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <textarea
                      placeholder="Leave your comment..."
                      value={commentInput[b._id] || ""}
                      onChange={(e) =>
                        setCommentInput((prev) => ({
                          ...prev,
                          [b._id]: e.target.value,
                        }))
                      }
                    />

                    <button
                      className="submitReviewButton"
                      onClick={() =>
                        handleSubmitReview(b._id, b.hotelId._id)
                      }
                    >
                      Submit Review
                    </button>
                  </>
                ) : (
                  <p style={{ marginTop: "10px", color: "#28a745" }}>
                    ✅ Thank you for reviewing!
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>No bookings yet.</p>
          )}
        </div>
      </div>
      <Subscribe />
      <Footer />
    </div>
  );
};

export default ProfileDashboard;
