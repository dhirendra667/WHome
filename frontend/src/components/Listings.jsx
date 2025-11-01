import { useEffect, useState } from "react";
import axios from "axios";
import { categories } from "../data";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";

const Listings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      const url =
        selectedCategory !== "All"
          ? `http://localhost:5000/api/v1/listing?category=${selectedCategory}`
          : "http://localhost:5000/api/v1/listing/all";

      const { data } = await axios.get(url);
      dispatch(setListings({ listings: data }));
    } catch (err) {
      console.error("Fetch Listings Failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  return (
    <div className="w-full">
      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-16 px-20 py-12 sm:px-5">
        {categories?.map((category, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(category.label)}
            className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${
              category.label === selectedCategory
                ? "text-rose-500"
                : "text-gray-600 hover:text-rose-500"
            }`}
          >
            <div className="text-3xl">{category.icon}</div>
            <p className="text-lg font-bold">{category.label}</p>
          </div>
        ))}
      </div>

      {/* Listings */}
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-wrap justify-center gap-4 px-16 pb-28 lg:px-5">
          {listings.map(
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
          )}
        </div>
      )}
    </div>
  );
};

export default Listings;
