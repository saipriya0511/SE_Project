const CommunitiyModel = require("../Models/communitiesModel");


const getCommunities = async (req, res) => {
    try {
        const data = await CommunitiyModel.find();
        if(data.length === 0){
            return res.status(404).json({message:"No data found"})
        }

        return res.json(data);
    } catch (error) {
        console.log(error);
    }
};

const addReview = async (req, res) => {

    const {listingId} = req.params
    const { userId, rating, feedback } = req.body;

    try {
        const listing = await CommunitiyModel.findById(listingId);
        if (!listing) {
            return res.status(200).json({ error: "Listing not found" });
        }

        if (listing.reviews.some((review) => review.userId.toString() === userId)) {
            return res.status(200).json({ error: "You have already reviewed this listing" });
        }

        listing.reviews.push({ userId, rating, feedback });
        await listing.save();
        console.log("Review added successfully");
        return res.json({ reviewMsg: "Review added successfully" });
    } 
    
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding review" });
    }
};


module.exports = {getCommunities}