import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom"; 

// Component export name remains TripList
const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?._id);
  const token = useSelector((state) => state.token);
  // Redux state name remains 'tripList'
  const tripList = useSelector((state) => state.user?.tripList); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Core Fetch Function ---
  // Renamed internally to getBookings for clarity
  const getBookings = async () => {
    if (!userId || !token) {
      setLoading(false);
      return; 
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/user/${userId}/trips`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setTripList(response.data.trips));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Bookings failed!", err.response?.data || err.message);
      setLoading(false);
    }
  };


    // --- Cancellation Logic ---
  const handleCancelBooking = async (bookingId) => {
      if (!userId || !token) {
        alert("You must be logged in to cancel a booking.");
        navigate("/login"); 
        return;
      }
      
      if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
          return;
      }

      try {
        await axios.delete(
          `http://localhost:5000/api/v1/booking/delete/${bookingId}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Re-fetch the list to update the UI
        getBookings(); 
        alert("Booking canceled successfully!");
        
      } catch (err) {
        console.error("Booking cancellation failed:", err.response?.data?.message || err.message);
        // Use the error message from the backend (like "Booking not found" or "Not authorized")
        alert(err.response?.data?.message || "Failed to cancel booking. Please try again.");
      }
    };

  useEffect(() => {
    getBookings();
  }, [userId, token]); // Dependencies

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />

      {/* --- Centered Content Wrapper --- */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-center mb-10">
          ✈️ Bookings Details
        </h1>

        {/* --- Card List / Empty State --- */}
        <div className="flex justify-center flex-wrap gap-8">
          {tripList?.length > 0 ? (
            tripList.map(
              ({
                listingId,
                hostId,
                startDate,
                endDate,
                totalPrice,
                _id: bookingId, // Destructure and rename to bookingId
                booking = true,
              }) => (
                <ListingCard
                  // Use the bookingId to ensure a unique key
                  key={bookingId} 
                  listingId={listingId._id}
                  creator={hostId._id}
                  listingPhotoPaths={listingId.listingPhotoPaths}
                  city={listingId.city}
                  province={listingId.province}
                  country={listingId.country}
                  category={listingId.category}
                  type={listingId.type} // Assuming type is on listingId for consistency
                  startDate={startDate}
                  endDate={endDate}
                  totalPrice={totalPrice}
                  booking={booking} // Pass as true
                  // Pass the booking ID and handler to the ListingCard for the cancel button
                  bookingId={bookingId}
                  onCancelBooking={handleCancelBooking}
                />
              )
            )
          ) : (
            // --- Empty State ---
            <div className="text-center py-20 w-full">
              <p className="text-2xl font-semibold text-gray-700 mb-4">
                You haven't booked any trips yet!
              </p>
              <p className="text-lg text-gray-500 mb-6">
                Ready for an adventure? Start exploring today.
              </p>
              <button
                onClick={() => navigate("/")} 
                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg shadow-md transition duration-200"
              >
                Start Browsing Listings
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TripList; 
