import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());
    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          return axios.put(`/rooms/availability/${roomId}`, {
            dates: alldates,
          });
        })
      );

      await axios.post("/bookings", {
        userId: user._id,
        hotelId,
        roomNumbers: selectedRooms,
        dates: alldates,
        price: selectedRooms.length * data[0].price * alldates.length,
      });

      setOpen(false);
      navigate("/profile");
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/reviews/hotel/${hotelId}`);
        setReviews(res.data);
      } catch (err) {
        setReviewError("Failed to load reviews.");
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, [hotelId]);

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <h2 className="rTitleMain">Select Your Rooms</h2>

        {loading ? (
          <p>Loading room information...</p>
        ) : error ? (
          <p>Failed to load rooms.</p>
        ) : (
          data.map((item) => (
            <div className="rItem" key={item._id}>
              <div className="rItemInfo">
                <div className="rTitle">{item.title}</div>
                <div className="rDesc">{item.desc}</div>
                <div className="rMax">
                  Max People: <b>{item.maxPeople}</b>
                </div>
                <div className="rPrice">€ {item.price}</div>
              </div>
              <div className="rSelectRooms">
                {item.roomNumbers.map((roomNumber) => (
                  <div className="room" key={roomNumber._id}>
                    <label>{roomNumber.number}</label>
                    <input
                      type="checkbox"
                      value={roomNumber._id}
                      onChange={handleSelect}
                      disabled={!isAvailable(roomNumber)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <button
          onClick={handleClick}
          className="rButton"
          disabled={selectedRooms.length === 0}
        >
          Confirm your Booking!
        </button>

        <div className="rReviews">
          <h3>Guest Reviews</h3>
          {reviewLoading ? (
            <p>Loading reviews...</p>
          ) : reviewError ? (
            <p>{reviewError}</p>
          ) : reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div className="rReviewItem" key={review._id}>
                <div className="reviewHeader">
                  <strong>{review.username}</strong>
                  <span>⭐ {review.rating}</span>
                </div>
                <p>{review.comment}</p>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                <hr />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reserve;
