// this is  App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

//leaflet for Map
// import 'leaflet/dist/leaflet.css';

import "./App.css";

//new css file 
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file




import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";
import TripList from "./pages/TripList";
import WishList from "./pages/WishList";
import PropertyList from "./pages/PropertyList";
import ReservationList from "./pages/ReservationList";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import ProtectedRoute from "./components/ProtectedRoute"; 
import HostDashboard from "./pages/HostDashboard";    


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/properties/:listingId" element={<ListingDetails />} />
          <Route path="/properties/category/:category" element={<CategoryPage />} />
          <Route path="/properties/search/:search" element={<SearchPage />} />
          
          {/* --- PROTECTED ROUTES START HERE --- */}
          
          {/* HOST-ONLY ROUTES: isHostRoute={true} 
            Requires: Logged in AND user.propertyList.length > 0
          */}
          <Route 
            path="/host-dashboard" 
            element={<ProtectedRoute isHostRoute={true}><HostDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/:userId/properties" 
            element={<ProtectedRoute isHostRoute={true}><PropertyList /></ProtectedRoute>} 
          />
          <Route 
            path="/:userId/reservations" 
            element={<ProtectedRoute isHostRoute={true}><ReservationList /></ProtectedRoute>} 
          />
          
          {/* STANDARD USER ROUTES: isHostRoute={false} (default) 
            Requires: Logged in (any user)
          */}
          <Route 
            path="/create-listing" 
            element={<ProtectedRoute><CreateListing /></ProtectedRoute>} 
          />
          <Route 
            path="/:userId/trips" 
            element={<ProtectedRoute><TripList /></ProtectedRoute>} 
          />
          <Route 
            path="/:userId/wishList" 
            element={<ProtectedRoute><WishList /></ProtectedRoute>} 
          />

          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

