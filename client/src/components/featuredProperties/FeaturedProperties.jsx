import { useState } from "react";
import "./featuredProperties.css";
import useFetch from "../../hooks/useFetch";

import { useNavigate } from "react-router-dom";

export const FeaturedProperties = () => {
  const navigate = useNavigate();
  const { data, loading } = useFetch("/hotels?featured=true&limit=4");

  return (
    <div className="fp">
      {loading ? (
        "Loading"
      ) : (
        data.map((item) => (
          <div
            className="fpItem"
            key={item._id}
            onClick={() => navigate(`/hotelDetails/${item._id}`)}
            style={{ cursor: "pointer" }}
          >
            <img src={item.photos[0]} alt="" className="fpImg" />
            <span className="fpName">{item.name}</span>
            <span className="fpCity">{item.city}</span>
            <span className="fpPrice">Starting from €{item.cheapestPrice}</span>
            {item.rating && (
              <div className="fpRating">
                <button>{item.rating}</button>
                <span>Excellent</span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};


export default FeaturedProperties;
