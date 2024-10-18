const express = require("express");
const router = express.Router();


const { addListing, getAllListings } = require("../Controllers/ListingsController");



router.get("/all-listings", getAllListings);
router.post("/add-listing", addListing);



module.exports = router;