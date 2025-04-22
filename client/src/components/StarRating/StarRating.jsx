import React from "react";

const StarRating = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const halfStar = rating - filledStars >= 0.5;
  const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

  return (
    <div style={{ color: "#FFD700", display: "flex", gap: "2px" }}>
      {"★".repeat(filledStars)}
      {halfStar && "☆"}
      {"☆".repeat(emptyStars)}
    </div>
  );
};

export default StarRating;
