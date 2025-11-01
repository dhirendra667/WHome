import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const reservationList = useSelector((state) => state.user.reservationList);
  const dispatch = useDispatch();

  const getReservationList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/user/${userId}/reservations`,
        {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT for varification
        },
       }
      );
      dispatch(setReservationList(response.data.reservations));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Reservation List failed!", err.message);
    }
  };

  useEffect(() => {
    if (userId) getReservationList();
  }, [userId]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <h1 className="text-3xl text-blue-600 mt-10 mb-6 px-10 sm:px-6 font-semibold">
        Your Reservation List
      </h1>

      <div className="flex justify-center flex-wrap gap-6 px-10 sm:px-5 pb-28">
        {reservationList?.map(
          ({
            listingId,
            hostId,
            startDate,
            endDate,
            totalPrice,
            booking = true,
          }) => (
            <ListingCard
              key={listingId._id}
              listingId={listingId._id}
              creator={hostId._id}
              listingPhotoPaths={listingId.listingPhotoPaths}
              city={listingId.city}
              province={listingId.province}
              country={listingId.country}
              category={listingId.category}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              booking={booking}
            />
          )
        )}
      </div>

      <Footer />
    </>
  );
};

export default ReservationList;
