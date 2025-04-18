// src/pages/hotelType/HotelType.jsx
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import "./hotelType.css";

const HotelType = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get("type"); // 👈 get type from query string

  const { data, loading } = useFetch(`/hotels?type=${type}`);

  return (
    <div className="hotelTypeContainer">
      <h1 className="hotelTypeTitle">{type}s</h1>
      {loading ? (
        <p className="loadingText">Loading...</p>
      ) : (
        <div className="hotelTypeList">
          {data.length === 0 ? (
            <p className="noHotels">No {type.toLowerCase()}s found.</p>
          ) : (
            data.map(hotel => (
              <div key={hotel._id} className="hotelTypeItem">
                <img
                  src={hotel.photos[0]}
                  alt={hotel.name}
                  className="hotelTypeImg"
                />
                <div className="hotelTypeDetails">
                  <h2>{hotel.name}</h2>
                  <p>{hotel.city}</p>
                  <p>${hotel.cheapestPrice}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HotelType;
