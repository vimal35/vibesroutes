import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import ExploreDestinations from "./pages/ExploreDestinations";
import Contact from "./pages/Contact";
import HotelList from "./pages/HotelList";
import HotelDetailPage from "./pages/HotelDetailPage";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>

      

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/explore-destinations" element={<ExploreDestinations />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/HotelList" element={<HotelList />} />

        <Route path="/HotelDetailPage" element={<HotelDetailPage />} />
        <Route path="/hotel/:id" element={<HotelDetailPage />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />


      </Routes>

    </BrowserRouter>
  );
}

export default App;
