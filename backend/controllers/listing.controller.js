import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";

/**
 * @CREATE_LISTING
 * @ROUTE @POST /api/v1/listing/create
 * @ACCESS Private
 */
export const createListing = async (req, res) => {
  try {
    // get user id from auth middleware
    const creator = req.user._id;

    const {
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    // upload images to cloudinary
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: "whome_listings" })
    );
    const uploadedResults = await Promise.all(uploadPromises);
    const listingPhotoPaths = uploadedResults.map((r) => r.secure_url);

    // clean up temp files
    req.files.forEach((file) => fs.unlinkSync(file.path));


    console.log(creator);

    //  create listing with current logged-in user as creator
    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    });

    const savedListing = await newListing.save();
    // console.log(savedListing);

    // Find the user and add the new listing ID to their propertyList
    const updatedUser = await User.findByIdAndUpdate(
      creator,
      { $push: { propertyList: savedListing._id } }, // $push efficiently adds the ID to the array
      { new: true, select: "-password" } // new:true returns the updated user, -password excludes sensitive data so that password by mistake cannot be send
    );


    res.status(201).json({
      message: "Listing created successfully",
      listing: savedListing,
      // send the updated user back for an even easier Redux update
      updatedUser: updatedUser
    });
  } catch (err) {
    console.error("❌ Error creating listing:", err);
    res
      .status(500)
      .json({ message: "Failed to create listing", error: err.message });
  }
};


/**
 * @GET_ALL_LISTINGS
 * @ROUTE @GET /api/v1/listing/all
 * @ACCESS Public
 */
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate("creator", "firstName lastName email");
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch listings", error: err.message });
  }
};

/**
 * @GET_LISTINGS_BY_CATEGORY
 * @ROUTE @GET /api/v1/listing?category={category}
 * @ACCESS Public
 */
export const getListingsByCategory = async (req, res) => {
  const qCategory = req.query.category;

  try {
    let listings;
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate("creator");
    } else {
      listings = await Listing.find().populate("creator");
    }
    res.status(200).json(listings);
  } catch (err) {
    res.status(404).json({ message: "Failed to fetch listings", error: err.message });
  }
};

/**
 * @SEARCH_LISTINGS
 * @ROUTE @GET /api/v1/listing/search/:search
 * @ACCESS Public
 */
export const searchListings = async (req, res) => {
  const { search } = req.params;

  try {
    let listings = [];

    if (search === "all") {
      listings = await Listing.find().populate("creator");
    } else {
      listings = await Listing.find({
        $or: [
          { category: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ],
      }).populate("creator");
    }

    res.status(200).json(listings);
  } catch (err) {
    res.status(404).json({ message: "Failed to search listings", error: err.message });
  }
};

/**
 * @GET_SINGLE_LISTING
 * @ROUTE @GET /api/v1/listing/:id
 * @ACCESS Public
 */
export const getSingleListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
    .populate("creator", "firstName lastName email profileImagePath avatar");

    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (err) {
    res.status(404).json({ message: "Failed to fetch listing", error: err.message });
  }
};


/**
 * @UPDATE_LISTING
 * @ROUTE @PUT /api/v1/listing/update/:id
 * @ACCESS Private (Owner only)
 */
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    //  Ownership verification
    if (req.user?._id.toString() !== listing.creator.toString()) {
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    let listingPhotoPaths = listing.listingPhotoPaths;

    //  If new images are uploaded
    if (req.files && req.files.length > 0) {
      //  1. Delete old photos from Cloudinary (if any)
      if (listingPhotoPaths && listingPhotoPaths.length > 0) {
        for (const url of listingPhotoPaths) {
          // Extract Cloudinary public ID from URL
          const parts = url.split("/");
          const folderAndFile = parts.slice(parts.indexOf("whome_listings")).join("/"); 
          const publicId = folderAndFile.split(".")[0]; // remove extension
          await cloudinary.uploader.destroy(publicId);
        }
      }

      //  2. Upload new images
      const uploadPromises = req.files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: "whome_listings" })
      );
      const uploadedResults = await Promise.all(uploadPromises);
      listingPhotoPaths = uploadedResults.map(result => result.secure_url);

      //  3. Delete temp local files
      req.files.forEach(file => fs.unlinkSync(file.path));
    }

    //  Update listing data
    const updatedData = { ...req.body, listingPhotoPaths };
    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).json({ message: "Failed to update listing", error: err.message });
  }
};



/**
 * @DELETE_LISTING
 * @ROUTE @DELETE /api/v1/listing/delete/:id
 * @ACCESS Private (Owner only)
 */
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Verify ownership
    if (req.user?._id.toString() !== listing.creator.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    // Delete all photos from Cloudinary
    for (const url of listing.listingPhotoPaths) {
      // Example URL: https://res.cloudinary.com/demo/image/upload/v12345/folder/file.jpg
      const publicId = url.split("/").slice(-1)[0].split(".")[0]; // Extract filename without extension
      await cloudinary.uploader.destroy(`whome_listings/${publicId}`);
    }

    // Finally, remove the listing record from MongoDB
    await Listing.findByIdAndDelete(id);

    res.status(200).json({ message: "Listing and photos deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete listing", error: err.message });
  }
};

