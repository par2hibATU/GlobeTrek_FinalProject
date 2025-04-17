export const Star = ({ width }) => {
    return (
      <span className="star">
        <span className="empty">☆</span>
        <span className="filled" style={{ width: `${width * 100}%` }}>★</span>
      </span>
    );
  };
  