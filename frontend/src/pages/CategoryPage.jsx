import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/listing?category=${category}`
      );
      dispatch(setListings({ listings: response.data }));
    } catch (err) {
      console.error("Fetch Listings Failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [category]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />

      <div className="reusable-listing-container">
        <h1 className="reusable-listing-title">
          {category} Listings
        </h1>

        <div className="reusable-listing-grid">
          {listings?.length > 0 ? (
            listings.map(
              ({
                _id,
                creator,
                listingPhotoPaths,
                city,
                province,
                country,
                category,
                type,
                price,
                booking = false,
              }) => (
                <ListingCard
                  key={_id}
                  listingId={_id}
                  creator={creator}
                  listingPhotoPaths={listingPhotoPaths}
                  city={city}
                  province={province}
                  country={country}
                  category={category}
                  type={type}
                  price={price}
                  booking={booking}
                />
              )
            )
          ) : (
            <p className="text-gray-500 text-lg mt-10">No listings found.</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CategoryPage;
