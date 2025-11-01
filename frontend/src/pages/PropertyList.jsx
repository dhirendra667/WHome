import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useEffect, useState } from "react";
import { setPropertyList } from "../redux/state";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

const PropertyList = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const propertyList = user?.propertyList;


  const dispatch = useDispatch();

  const getPropertyList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/user/${user._id}/properties`,
        {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include JWT
        },
      }
      );
      dispatch(setPropertyList(response.data.properties));
      setLoading(false);
    } catch (err) {
      console.log("Fetch all properties failed:", err.message);
    }
  };

  useEffect(() => {
    if (user?._id) getPropertyList();
  }, [user?._id]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <h1 className="text-3xl text-blue-600 mt-10 mb-6 px-10 sm:px-6 font-semibold">
        Your Property List
      </h1>

      <div className="flex justify-center flex-wrap gap-6 px-10 sm:px-5 pb-28">
        {propertyList?.map(
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

      <Footer />
    </>
  );
};

export default PropertyList;
