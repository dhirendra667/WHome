import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/AppError.js";
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";


/**
 * @CREATE_BOOKING
 * @ROUTE @POST {{URL}}/api/v1/booking/create
 * @ACCESS Private (Logged in user only)
 */
export const createBooking = asyncHandler(async (req, res, next) => {
  const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;

  // Check required fields
  if (!customerId || !hostId || !listingId || !startDate || !endDate || !totalPrice) {
    return next(new AppError("All required fields must be provided", 400));
  }

  const booking = await Booking.create({
    customerId,
    hostId,
    listingId,
    startDate,
    endDate,
    totalPrice,
  });

  await User.findByIdAndUpdate(customerId, {
  $push: { tripList: booking._id },
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    booking,
  });
});

/**
 * @GET_ALL_BOOKINGS
 * @ROUTE @GET {{URL}}/api/v1/booking/all
 * @ACCESS Private/Admin (optional)
 */
export const getAllBookings = asyncHandler(async (_req, res, _next) => {
  const bookings = await Booking.find()
    .populate("customerId", "firstName lastName email")
    .populate("hostId", "firstName lastName email")
    .populate("listingId", "title price city");

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

/**
 * @GET_USER_BOOKINGS
 * @ROUTE @GET {{URL}}/api/v1/booking/user/:id
 * @ACCESS Private (User only)
 */
export const getUserBookings = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bookings = await Booking.find({ customerId: id })
    .populate("listingId", "title city price")
    .populate("hostId", "firstName lastName email");

  if (!bookings || bookings.length === 0) {
    return next(new AppError("No bookings found for this user", 404));
  }

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

/**
 * @GET_SINGLE_BOOKING
 * @ROUTE @GET {{URL}}/api/v1/booking/:id
 * @ACCESS Private
 */
export const getSingleBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const booking = await Booking.findById(id)
    .populate("customerId", "firstName lastName email")
    .populate("hostId", "firstName lastName email")
    .populate("listingId", "title city price");

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  res.status(200).json({
    success: true,
    booking,
  });
});

/**
 * @UPDATE_BOOKING
 * @ROUTE @PUT {{URL}}/api/v1/booking/update/:id
 * @ACCESS Private (Owner/Admin)
 */
export const updateBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { startDate, endDate, totalPrice } = req.body;

  const booking = await Booking.findById(id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  //  Only the user who made the booking or an admin can update it
  if (
    booking.customerId.toString() !== req.user._id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    return next(new AppError("You are not authorized to update this booking", 403));
  }

  // Update only provided fields
  if (startDate) booking.startDate = startDate;
  if (endDate) booking.endDate = endDate;
  if (totalPrice) booking.totalPrice = totalPrice;

  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking updated successfully",
    booking,
  });
});


/**
 * @DELETE_BOOKING
 * @ROUTE @DELETE {{URL}}/api/v1/booking/delete/:id
 * @ACCESS Private (Owner only)
 */
export const deleteBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  // --- AUTH CHECK: Only the customer can delete it ---
  if (booking.customerId.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to cancel this booking. Only the original customer can do so.", 403));
  }
  // -----------------------------------------------------------------

  // 1. Remove booking ID from the user's tripList array for data integrity
  await User.findByIdAndUpdate(booking.customerId, {
    $pull: { tripList: id },
  });

  // 2. Delete the booking document
  await booking.deleteOne();

  res.status(200).json({
    success: true,
    message: "Booking canceled successfully",
  });
});
