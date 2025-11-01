import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.controller.js";

import { isLoggedIn, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @ROUTE POST /api/v1/booking/create
 * @DESC Create a new booking (Logged in user)
 */
router.post("/create", isLoggedIn, createBooking);

/**
 * @ROUTE GET /api/v1/booking/all
 * @DESC Get all bookings (Admin only)
 */
router.get("/all", isLoggedIn, authorizeRoles("ADMIN"), getAllBookings);

/**
 * @ROUTE GET /api/v1/booking/user/:id
 * @DESC Get bookings of a particular user
 */
router.get("/user/:id", isLoggedIn, getUserBookings);

/**
 * @ROUTE GET /api/v1/booking/:id
 * @DESC Get a single booking by ID
 */
router.get("/:id", isLoggedIn, getSingleBooking);

/**
 * @ROUTE GET /api/v1/booking/update/:id
 * @DESC Delete booking (Owner/Admin)
 */
router.put("/update/:id", isLoggedIn, updateBooking); 


/**
 * @ROUTE DELETE /api/v1/booking/delete/:id
 * @DESC Delete booking (Owner/Admin)
 */
router.delete("/delete/:id", isLoggedIn, deleteBooking);

export default router;
