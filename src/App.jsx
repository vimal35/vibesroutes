import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import ExploreDestinations from "./pages/ExploreDestinations";
import Contact from "./pages/Contact";
import HotelList from "./pages/HotelList";
import HotelDetailPage from "./pages/HotelDetailPage";
import AdminPanel from "./pages/AdminPanel";
import ListYourProperty from "./pages/ListYourProperty";
import PolicyPage from "./pages/PolicyPage";
import CustomerEnquiry from "./pages/CustomerEnquiry";
import SignIn from "./pages/SignIn";
import SignUpUnavailable from "./pages/SignUpUnavailable";

function App() {
  return (
    <BrowserRouter>

      

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/explore-destinations" element={<ExploreDestinations />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/list-your-property" element={<ListYourProperty />} />

        <Route path="/customer-enquiry" element={<CustomerEnquiry />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUpUnavailable />} />

        <Route path="/refund-policy" element={<PolicyPage policy="refund" />} />
        <Route path="/privacy-policy" element={<PolicyPage policy="privacy" />} />
        <Route path="/terms-and-conditions" element={<PolicyPage policy="terms" />} />
        <Route path="/cancellation-policy" element={<PolicyPage policy="cancellation" />} />

        <Route path="/HotelList" element={<HotelList />} />

        <Route path="/HotelDetailPage" element={<HotelDetailPage />} />
        <Route path="/hotel/:id" element={<HotelDetailPage />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />


      </Routes>

    </BrowserRouter>
  );
}

export default App;
