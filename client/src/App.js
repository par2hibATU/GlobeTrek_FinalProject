import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Hotel from "./pages/hotel/Hotel";
import MailList from "./pages/mailList/MailList";
import Map from "./pages/map/Map";
import Contact from "./pages/contact/Contact";
import Weather from "./pages/weather/Weather";
import Login from "./pages/login/Login";
import ProfileDashboard from "./pages/profile/ProfileDashboard";


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path = "/hotels" element = {<List />} />
      <Route path = "/hotels/:id" element = {<Hotel />} />
      <Route path="/email" element = {<MailList />} />
      <Route path="/map" element = {<Map />} />
      <Route path="/contact" element = {<Contact />} />
      <Route path="/weather" element = {<Weather />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/profile" element={<ProfileDashboard />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
