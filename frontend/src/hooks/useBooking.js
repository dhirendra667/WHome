// hooks/useBooking.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export function useBooking(listing, listingId) {
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const customerId = useSelector((state) => state?.user?._id);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [guests, setGuests] = useState(1);

  const handleDateSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  // Calculate day count, ensuring at least 1 day if start and end are the same
  const dayCount = Math.max(
    Math.round((end - start) / (1000 * 60 * 60 * 24)),
    1
  );

  const totalPrice = listing?.price * dayCount;

  const handleSubmit = async () => {
    if (!customerId) return alert("Please log in to book this stay.");

    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing?.creator?._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: totalPrice,
      };

      const response = await axios.post(
        "http://localhost:5000/api/v1/booking/create",
        bookingForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201 || response.status === 200) {
        navigate(`/${customerId}/trips`);
      }
    } catch (err) {
      console.error(
        "❌ Submit Booking Failed:",
        err.response?.data || err.message
      );
    }
  };

  return {
    dateRange,
    handleDateSelect,
    dayCount,
    guests,
    setGuests,
    totalPrice,
    handleSubmit,
  };
}