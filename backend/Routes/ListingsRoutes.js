const express = require("express");
const router = express.Router();


const { addListing, getAllListings, getPlaceDetails, getListingsBySearch, addHouseSearchHistory, sendMatchedListingsEmail, getListingsByUserId, getListingById, updateListing } = require("../Controllers/ListingsController");
const { uploadFile } = require("../s3");
const { bookUpload } = require("../multer");

 
router.get("/all-listings", getAllListings);

router.get("/listing/:id", getListingById);

router.post("/add-listing",bookUpload, addListing);

router.post("/autocomplete", getPlaceDetails);

router.get("/all-listings/search", getListingsBySearch);

router.post("/listings-search-history", addHouseSearchHistory);

router.get("/mail", sendMatchedListingsEmail);

router.get("/user-listings/:userId", getListingsByUserId);

router.put("/update-listing/:id", bookUpload, updateListing);



module.exports = router;