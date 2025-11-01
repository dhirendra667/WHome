import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getUserDetails,
  getUserTrips,
  toggleWishlist,
  getUserProperties,
  getUserReservations,
} from "../controllers/user.controller.js";

const router = Router();

//Get the details of the user
router.get("/:userId", isLoggedIn, getUserDetails);

// Get all trips made by the logged-in user
router.get("/:userId/trips", isLoggedIn, getUserTrips);

// Add/Remove a listing from user's wishlist
router.patch("/:userId/:listingId", isLoggedIn, toggleWishlist);

// Get all properties created by the logged-in user
router.get("/:userId/properties", isLoggedIn, getUserProperties);

// Get all reservations (for hosts)
router.get("/:userId/reservations", isLoggedIn, getUserReservations);

export default router;



























// import { Router } from "express";
// import { isLoggedIn } from "../middlewares/auth.middleware.js";
// import Booking from "../models/booking.model.js";
// import User from "../models/user.model.js";
// import Listing from "../models/listing.model.js";

// const router = Router();

// // GET user trips (only for logged-in user)
// router.get("/:userId/trips", isLoggedIn, async (req, res) => {
//   try {
//     // Ownership check
//     if (req.user._id.toString() !== req.params.userId) {
//       return res.status(403).json({ message: "Unauthorized access to trips" });
//     }

//     const trips = await Booking.find({ customerId: req.params.userId })
//       .populate("customerId", "firstName lastName email")
//       .populate("hostId", "firstName lastName email")
//       .populate("listingId");

//     res.status(200).json(trips);
//   } catch (err) {
//     res.status(404).json({ message: "Cannot find trips!", error: err.message });
//   }
// });

// // ADD/REMOVE listing to wishlist (only self)
// router.patch("/:userId/:listingId", isLoggedIn, async (req, res) => {
//   try {
//     // Ownership check
//     if (req.user._id.toString() !== req.params.userId) {
//       return res.status(403).json({ message: "Unauthorized action on wishlist" });
//     }

//     const user = await User.findById(req.params.userId);
//     const listing = await Listing.findById(req.params.listingId).populate("creator");

//     const exists = user.wishList.find(
//       (item) => item._id.toString() === req.params.listingId
//     );

//     if (exists) {
//       user.wishList = user.wishList.filter(
//         (item) => item._id.toString() !== req.params.listingId
//       );
//       await user.save();
//       res.json({ message: "Removed from wishlist", wishList: user.wishList });
//     } else {
//       user.wishList.push(listing);
//       await user.save();
//       res.json({ message: "Added to wishlist", wishList: user.wishList });
//     }
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // GET user's own properties (only self)
// router.get("/:userId/properties", isLoggedIn, async (req, res) => {
//   try {
//     // Ownership check
//     if (req.user._id.toString() !== req.params.userId) {
//       return res.status(403).json({ message: "Unauthorized access to properties" });
//     }

//     const properties = await Listing.find({ creator: req.params.userId })
//       .populate("creator", "firstName lastName email");

//     res.json(properties);
//   } catch (err) {
//     res.status(404).json({ message: "Cannot find properties", error: err.message });
//   }
// });

// // GET reservations (only for hosts fetching their reservations)
// router.get("/:userId/reservations", isLoggedIn, async (req, res) => {
//   try {
//     // Ownership check
//     if (req.user._id.toString() !== req.params.userId) {
//       return res.status(403).json({ message: "Unauthorized access to reservations" });
//     }

//     const reservations = await Booking.find({ hostId: req.params.userId })
//       .populate("customerId", "firstName lastName email")
//       .populate("hostId", "firstName lastName email")
//       .populate("listingId");

//     res.json(reservations);
//   } catch (err) {
//     res.status(404).json({ message: "Cannot find reservations", error: err.message });
//   }
// });

// export default router;

