import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/AppError.js";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Listing from "../models/listing.model.js";

/**
 * Utility to safely get user ID from token
 */
const getTokenUserId = (req) => req.user?._id?.toString() || req.user?.id?.toString();

/**
 * @GET_USER_DETAILS
 * @ROUTE @GET /api/v1/user/:userId
 * @ACCESS Private (Logged-in user can fetch their own profile)
 */
export const getUserDetails = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const tokenUserId = getTokenUserId(req);

  // Ownership check (optional, but good security practice)
  if (!tokenUserId || tokenUserId !== userId) {
    return next(new AppError("Unauthorized access to user details", 403));
  }

  // Find the user and POPULATE the wishList field so that the wishlist can work
  const user = await User.findById(userId)
    .select("-password") // Don't return the password hash
    .populate({
      path: "wishList", // Populate listings in the wishList array
      model: "Listing",
    });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Send the user object with the populated wishList
  res.status(200).json({
    success: true,
    message: "User details fetched successfully",
    user,
  });
});


/**
 * @GET_USER_TRIPS
 * @ROUTE @GET /api/v1/user/:userId/trips
 * @ACCESS Private
 */
export const getUserTrips = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const tokenUserId = getTokenUserId(req);

  // Ownership check
  if (!tokenUserId || tokenUserId !== userId) {
    return next(new AppError("Unauthorized access to trips", 403));
  }

  const trips = await Booking.find({ customerId: userId })
    .populate("customerId", "firstName lastName email")
    .populate("hostId", "firstName lastName email")
    .populate("listingId");

  if (!trips.length) {
    return res.status(200).json({
      success: true,
      message: "No trips found for this user",
      trips: [],
    });
  }

  res.status(200).json({
    success: true,
    trips,
  });
});


/**
 * @TOGGLE_WISHLIST
 * @ROUTE @PATCH /api/v1/user/:userId/:listingId
 * @ACCESS Private
 */
export const toggleWishlist = asyncHandler(async (req, res, next) => {
  const { userId, listingId } = req.params;
  const tokenUserId = getTokenUserId(req);

  // 1. Ownership Check
  if (!tokenUserId || tokenUserId !== userId) {
    return next(new AppError("Unauthorized action on wishlist", 403));
  }
  
  // 2. Listing Existence Check
  const listing = await Listing.findById(listingId); 
  if (!listing) {
    return next(new AppError("Listing not found", 404));
  }

  // Find the user to check the current state of the wishlist
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Check if the listingId (ObjectId) already exists in the array
  const exists = user.wishList.some((item) => item.toString() === listingId);

  let updatedUser;
  let message;

  if (exists) {
    // Action: REMOVE the listing ID (similar to how I handled deleting a trip ID (the concept which I used in tripList))
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishList: listingId } }, // $pull removes the ID
      { new: true }
    ).populate("wishList"); // <-- CRITICAL: Populate to send full data to frontend
    message = "Removed from wishlist";
  } else {
    // Action: ADD the listing ID
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishList: listingId } }, // $addToSet adds the ID safely
      { new: true }
    ).populate("wishList"); // <-- CRITICAL: Populate to send full data to frontend
    message = "Added to wishlist";
  }

  // 3. Send Response
  res.status(200).json({
    success: true,
    message: message,
    // The wishList sent to the frontend is now an array of populated Listing objects
    wishList: updatedUser.wishList, 
  });
});


/**
 * @GET_USER_PROPERTIES
 * @ROUTE @GET /api/v1/user/:userId/properties
 * @ACCESS Private
 */
export const getUserProperties = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const tokenUserId = getTokenUserId(req);

  if (!tokenUserId || tokenUserId !== userId) {
    return next(new AppError("Unauthorized access to properties", 403));
  }

  const properties = await Listing.find({ creator: userId })
    .populate("creator", "firstName lastName email");

  res.status(200).json({
    success: true,
    properties,
  });
});

/**
 * @GET_USER_RESERVATIONS
 * @ROUTE @GET /api/v1/user/:userId/reservations
 * @ACCESS Private
 */
export const getUserReservations = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const tokenUserId = getTokenUserId(req);

  if (!tokenUserId || tokenUserId !== userId) {
    return next(new AppError("Unauthorized access to reservations", 403));
  }

  const reservations = await Booking.find({ hostId: userId })
    .populate("customerId", "firstName lastName email")
    .populate("hostId", "firstName lastName email")
    .populate("listingId");

  res.status(200).json({
    success: true,
    reservations,
  });
});
