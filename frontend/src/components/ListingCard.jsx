import { useState } from "react";
import axios from "axios";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";
import { MdOutlineDateRange } from "react-icons/md"; 
import { FaMoneyBillWave } from "react-icons/fa"; 

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  // Removed: province
  country,
  // Removed: category
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
  // NEW PROPS for booking cancellation
  bookingId,
  onCancelBooking,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  // const isLiked = wishList?.some((item) => item?._id === listingId);

  const isLiked = wishList?.some(
    (item) => item?._id === listingId || item === listingId // Checks if item is a populated object OR a raw ID
  );

  // Image navigation logic remains the same
  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  // Wishlist PATCH request logic
  const patchWishList = async () => {
    if (!user) {
      navigate("/login"); 
      return;
    }

    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/v1/user/${user._id}/${listingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setWishList(data.wishList));
    } catch (err) {
      console.error("❌ Wishlist update failed:", err.response?.data || err.message);
    }
  };

  return (
    <div
      className="flex flex-col w-[300px] bg-white border border-gray-200 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl group"
    >
      {/* Image Slider Section */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-2xl">
        {/* Clickable Area for Navigation */}
        <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={() => navigate(`/properties/${listingId}`)}
        ></div>

        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths?.map((photo, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full"
            >
              <img
                src={photo}
                alt={`photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        {listingPhotoPaths.length > 1 && (
            <>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        goToPrevSlide();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/90 rounded-full p-1 flex items-center justify-center shadow-lg transition-all z-20"
                >
                    <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        goToNextSlide();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/90 rounded-full p-1 flex items-center justify-center shadow-lg transition-all z-20"
                >
                    <ArrowForwardIos sx={{ fontSize: "15px" }} />
                </button>
            </>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            patchWishList();
          }}
          disabled={!user}
          className="absolute top-3 right-3 text-2xl z-20 cursor-pointer transition-transform duration-150 transform hover:scale-110"
        >
          {isLiked ? (
            <Favorite sx={{ color: "#FF385C" }} /> 
          ) : (
            <Favorite sx={{ color: "white", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
          )}
        </button>
      </div>

      {/* Details Section (Simplified) */}
      <div 
        className="p-4 flex flex-col gap-1.5"
        onClick={(e) => {
          if (e.target.tagName !== 'BUTTON') {
             navigate(`/properties/${listingId}`);
          }
        }}
      >
        {/* Title: Only City and Country (e.g., "Apartment in Lucknow") */}
        <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
          {type || "Listing"} in {city}
        </h3>
        
        {/* Secondary Detail: Hidden to maintain strict simplicity 
        <p className="text-gray-600 text-base">{country}</p> 
        */}

        {!booking ? (
          // --- Default Listing View  ---
          <div className="flex justify-between items-center mt-1">
            <p className="text-gray-900">
                {/* E.g., $2463 for 2 nights (if you calculate the total nights in the map function) */}
                <span className="font-extrabold text-lg">${price}</span>{" "}
                <span className="text-base text-gray-600">per night</span>
            </p>
          </div>
        ) : (
          // --- Booking View (My Bookings - Required for function) ---
          <div className="flex flex-col gap-2 mt-2">
            {/* Dates */}
            <div className="flex items-center gap-2 text-md font-medium text-blue-700 bg-blue-50 p-2 rounded-lg">
                <MdOutlineDateRange className="text-lg" />
                <span className="font-bold">{startDate}</span> - 
                <span className="font-bold">{endDate}</span>
            </div>
            
            {/* Total Price */}
            <div className="flex items-center gap-2 text-md font-medium text-green-700">
                <FaMoneyBillWave className="text-lg" />
                <span className="font-extrabold text-xl">${totalPrice}</span>{" "}
                <span className="text-base text-gray-500">total paid</span>
            </div>

            {/* Cancel Booking Button */}
            {onCancelBooking && bookingId && (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onCancelBooking(bookingId);
                    }}
                    className="mt-3 w-full py-2 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition duration-200 shadow-md"
                >
                    Cancel Booking
                </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;










// import { useState } from "react";
// import axios from "axios";
// import {
//   ArrowForwardIos,
//   ArrowBackIosNew,
//   Favorite,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { setWishList } from "../redux/state";

// const ListingCard = ({
//   listingId,
//   creator,
//   listingPhotoPaths,
//   city,
//   province,
//   country,
//   category,
//   type,
//   price,
//   startDate,
//   endDate,
//   totalPrice,
//   booking,
// }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.token);
//   const user = useSelector((state) => state.user);
//   const wishList = user?.wishList || [];

//   // Check if the current listing is already liked
//   const isLiked = wishList?.some((item) => item?._id === listingId);

//   // Image navigation
//   const goToPrevSlide = () => {
//     setCurrentIndex(
//       (prevIndex) =>
//         (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
//     );
//   };

//   const goToNextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
//   };

//   // Wishlist PATCH request
//   const patchWishList = async () => {
//     if (!user?._id === creator?._id) return;
//     try {
//       const { data } = await axios.patch(
//         `http://localhost:5000/api/v1/user/${user._id}/${listingId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             // Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       // console.log("✅ Wishlist updated successfully:", data.wishList);
//       dispatch(setWishList(data.wishList));
//     } catch (err) {
//       console.error("❌ Wishlist update failed:", err.response?.data || err.message);
//     }
//   };

//   return (
//     <div
//       className="relative cursor-pointer rounded-xl p-2 transition-shadow hover:shadow-lg duration-200"
//       onClick={() => navigate(`/properties/${listingId}`)}
//     >
//       {/* Image Slider */}
//       <div className="w-[300px] overflow-hidden rounded-xl mb-2">
//         <div
//           className="flex transition-transform duration-500 ease-in-out"
//           style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//         >
//           {listingPhotoPaths?.map((photo, index) => (
//             <div
//               key={index}
//               className="relative flex-shrink-0 w-full h-[270px] flex items-center"
//             >
//               <img
//                 src={photo}
//                 alt={`photo ${index + 1}`}
//                 className="w-full h-full object-cover brightness-90 rounded-xl"
//               />

//               {/* Prev Button */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   goToPrevSlide();
//                 }}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 flex items-center justify-center shadow"
//               >
//                 <ArrowBackIosNew sx={{ fontSize: "15px" }} />
//               </button>

//               {/* Next Button */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   goToNextSlide();
//                 }}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 flex items-center justify-center shadow"
//               >
//                 <ArrowForwardIos sx={{ fontSize: "15px" }} />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Details */}
//       <h3 className="text-lg font-semibold">
//         {city}, {province}, {country}
//       </h3>
//       <p className="text-gray-700 text-base">{category}</p>

//       {!booking ? (
//         <>
//           <p className="text-gray-700 text-base">{type}</p>
//           <p className="text-gray-900">
//             <span className="font-bold text-lg">${price}</span>{" "}
//             <span className="text-sm text-gray-500">per night</span>
//           </p>
//         </>
//       ) : (
//         <>
//           <p className="text-gray-700 text-base">
//             {startDate} - {endDate}
//           </p>
//           <p className="text-gray-900">
//             <span className="font-bold text-lg">${totalPrice}</span>{" "}
//             <span className="text-sm text-gray-500">total</span>
//           </p>
//         </>
//       )}

//       {/* Wishlist Button */}
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           patchWishList();
//         }}
//         disabled={!user}
//         className="absolute top-5 right-5 text-xl z-50 cursor-pointer hover:scale-110 transition-transform duration-150"
//         style={{ cursor: "pointer" }}
//       >
//         {isLiked ? (
//           <Favorite sx={{ color: "red" }} />
//         ) : (
//           <Favorite sx={{ color: "white", stroke: "black", strokeWidth: 1 }} />
//         )}
//       </button>
//     </div>
//   );
// };

// export default ListingCard;
