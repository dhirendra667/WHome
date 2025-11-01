import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import { setWishList } from "../redux/state";
import Loader from "../components/Loader"; 
import { useNavigate } from "react-router-dom"; 

const WishList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?._id);
  const token = useSelector((state) => state.token);
  const wishList = useSelector((state) => state.user?.wishList);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Core Fetch Function ---
  const getWishList = async () => {
    if (!userId || !token) {
      setLoading(false);
      return; 
    }

    try {
      // NOTE: I assume you have a GET /api/v1/user/:userId route that
      // fetches the user object and POPULATES the 'wishList' field.
      // If you don't, this logic won't work, and you need to create that route.
      const response = await axios.get(
        `http://localhost:5000/api/v1/user/${userId}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update Redux state with the newly fetched, populated wishList
      dispatch(setWishList(response.data.user.wishList)); 
      setLoading(false);

    } catch (err) {
      console.error("Fetch WishList failed!", err.response?.data || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getWishList();
  }, [userId, token]); // Run fetch when user/token changes

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />

      {/* --- Centered Content Wrapper --- */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-center mb-10">
          ❤️ Your **Wish List**
        </h1>

        {/* --- Card List / Empty State --- */}
        <div className="flex justify-center flex-wrap gap-8">
          {wishList?.length > 0 ? (
            wishList.map(
              // **SAFE MAPPING:** Access properties via dot notation (similar to TripList implemented)
              (listing) => {
                if (!listing || !listing._id) return null; // Safety check

                return (
                  <ListingCard
                    key={listing._id}
                    listingId={listing._id}
                    creator={listing.creator}
                    listingPhotoPaths={listing.listingPhotoPaths}
                    city={listing.city}
                    province={listing.province}
                    country={listing.country}
                    category={listing.category}
                    type={listing.type}
                    price={listing.price}
                    // Pass other props if necessary
                    booking={false} // Always false for wishlist
                  />
                );
              }
            )
          ) : (
            // --- Empty State ---
            <div className="text-center py-20 w-full">
              <p className="text-2xl font-semibold text-gray-700 mb-4">
                Nothing saved yet!
              </p>
              <p className="text-lg text-gray-500 mb-6">
                Add listings you love by clicking the ❤️ icon.
              </p>
              <button
                onClick={() => navigate("/")} 
                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg shadow-md transition duration-200"
              >
                Start Exploring Listings
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default WishList;
