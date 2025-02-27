import "./subscribe.css"

export const Subscribe = () => {
  return (
    <div className="mail">
        <h1 className="mailTitle">Sign up to our Newsletter</h1>
        <span className="mailDesc">Sign up and we will send the best deals to you</span>
        <div className="mailInputContainer">
            <input type="text" placeholder="Your Email" />
            <button >Subscribe</button>
        </div>
    </div>
  )
}


export default Subscribe;