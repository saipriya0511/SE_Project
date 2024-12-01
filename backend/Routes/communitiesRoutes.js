const express = require("express");
const { getCommunities, addCommunitySearchHistory, addReview, getCommunitiesBySearch, getCommunitiesById } = require("../Controllers/communitiescontroller");
const { addHouseSearchHistory, getListingsBySearch } = require("../Controllers/ListingsController");
const router = express.Router();


router.get('/all-communities', getCommunities);


router.get("/all-communities/search", getCommunitiesBySearch);

router.post("/communities-search-history", addCommunitySearchHistory);

router.post("/add-review/:listingId", addReview);

router.get("/community/:id", getCommunitiesById);


module.exports = router 