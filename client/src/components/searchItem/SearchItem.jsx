import { Link } from "react-router-dom"
import "./searchItem.css"

export const SearchItem = ({item}) => {
  return (
    <div className="searchItem">
        <img src={item.photos[0]}
        alt="" className="siImg" />
        <div className="siDesc">
            <h1 className="siTitle">{item.name}</h1>
            <span className="siDistance">{item.distance}m from center</span>
            <span className="siTaxiOp">Free Taxi pickup from Coach Station</span>
            <span className="siSubtitle">Free continental breakfast and Wifi connection</span>
            <span className="siFeatures">Full kind size bedroom with well furnised marbel Floor apartment</span>
            <span className="siCancelOp">Free Cancellation</span>
            <span className="siCancelOpSubtitle">Lock your Room today. Great price! Great Ambience! Great Chance!</span>
        </div>
        <div className="siDetails">
          {item.rating && <div className="siRating">
            <span>Excellent</span>
            <button>{item.rating}</button>
          </div>}
          <div className="siDetailsTexts">
            <span className="siPrice">£{item.cheapestPrice}</span>
            <span className="siTaxOp">Includes taxes and fees</span>
            <Link to={'/hotels/${item._id}'}>
              <button className="siCheckButton">See availability</button>
            </Link>
          </div>
        </div>
    </div>
  )
}

export default SearchItem
