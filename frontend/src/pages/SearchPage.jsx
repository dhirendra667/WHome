import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

import { setListings } from "../redux/state";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const { search } = useParams();
  const listings = useSelector((state) => state.listings);
  const dispatch = useDispatch();

  const getSearchListings = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/listing/search/${search}`
      );
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.error("❌ Fetch Search Listings Failed:", err.message);
    }
  };

  useEffect(() => {
    getSearchListings();
  }, [search]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <h1 className="text-3xl font-semibold text-blue-600 mt-10 mb-10 px-6 md:px-16 capitalize">
        {search} Listings
      </h1>

      <div className="flex flex-wrap justify-center gap-6 px-6 md:px-16 pb-28">
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
          <p className="text-gray-500 text-lg mt-10">
            No listings found for “{search}”.
          </p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SearchPage;
