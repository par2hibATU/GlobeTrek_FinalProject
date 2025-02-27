import React from "react";
import "./featured.css";
import useFetch from "../../hooks/useFetch.js";

export const Featured = () => {
  //used the proxy from the package
  const {data, loading, error } = useFetch("/hotels/countByCity?cities=Galway,Dublin,Limerick,Letterkenny")

  return (
    <div className="featured">
      {loading ? ("Loading please wait") : ( 
        <>
        <div className="featuredItem">
        <img
          src="https://news.delta.com/sites/default/files/2023-08/gettyimages-637796228.jpg"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
            <h1>Galway</h1>
            <h2>{data[0]} properties</h2>
        </div>
      </div>
      <div className="featuredItem">
            <img
            src="https://th.bing.com/th/id/OIP.ZHoNkw9xlZwTUQOsQ2IaEwHaDt?w=800&h=400&rs=1&pid=ImgDetMain"
            alt=""
            className="featuredImg"
            />
            <div className="featuredTitles">
            <h1>Dublin</h1>
            <h2>{data[1]} properties</h2>
            </div>
        </div>
        <div className="featuredItem">
            <img
            src="https://cdn.audleytravel.com/700/499/79/1322766-king-johns-castle.jpg"
            alt=""
            className="featuredImg"
            />
            <div className="featuredTitles">
            <h1>Limerick</h1>
            <h2>{data[2]} properties</h2>
            </div>
        </div>
        </>
      )}
    </div>
  );
};
export default Featured;
