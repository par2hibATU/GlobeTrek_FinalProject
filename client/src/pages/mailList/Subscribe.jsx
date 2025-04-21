import "./subscribe.css";
import { Link, useNavigate } from "react-router-dom";

export const Subscribe = () => {
  const navigate = useNavigate();

  return (
    <div className="mail">
      <h1 className="mailTitle">Sign up to our Newsletter</h1>
      <span className="mailDesc">
        Sign up and we will send the best deals to you
      </span>
      <div className="mailInputContainer">
        <input type="text" placeholder="Your Email" />
        <button onClick={() => navigate("/contact")}>Subscribe</button>
      </div>
    </div>
  );
};

export default Subscribe;
