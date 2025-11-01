import { Router } from "express";
import multer from "multer";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createListing,
  getAllListings,
  getSingleListing,
  updateListing,
  deleteListing,
  getListingsByCategory,
  searchListings
} from "../controllers/listing.controller.js";

const router = Router();

/* -------------------------------
   MULTER SETUP — TEMP FILE UPLOAD
---------------------------------- */
// Files will be temporarily stored in `uploads/` (auto-deleted after Cloudinary upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // temporary storage, files deleted later in controller
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/* -------------------------------
   ROUTES
---------------------------------- */

// @CREATE_LISTING
// POST /api/v1/listing/create
router.post("/create", isLoggedIn, upload.array("listingPhotos"), createListing);

// @GET_ALL_LISTINGS
// GET /api/v1/listing/all
router.get("/all", getAllListings);

// @GET_LISTINGS_BY_CATEGORY
// GET /api/v1/listing?category={category}
router.get("/", getListingsByCategory);

// @SEARCH_LISTINGS
// GET /api/v1/listing/search/:search
router.get("/search/:search", searchListings);

// @GET_SINGLE_LISTING
// GET /api/v1/listing/:id
router.get("/:id", getSingleListing);

// @UPDATE_LISTING
// PUT /api/v1/listing/update/:id
router.put("/update/:id", isLoggedIn, upload.array("listingPhotos"), updateListing);

// @DELETE_LISTING
// DELETE /api/v1/listing/delete/:id
router.delete("/delete/:id", isLoggedIn, deleteListing);

export default router;

