const CommunitiyModel = require("../Models/communitiesModel");
const UserDetails = require("../Models/AuthenticationModel");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

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

const getCommunitiesBySearch = async (req, res) => {
    try {
        const { roomsCount, bathroomCount, lookingForCount, distance, price } = req.query;

        // Build query object dynamically based on provided filters
        const query = {};
        if (roomsCount) query.roomsCount = roomsCount === "more than 5" ? { $gt: 5 } : parseInt(roomsCount);
        if (bathroomCount) query.bathroomCount = bathroomCount === "more than 5" ? { $gt: 5 } : parseInt(bathroomCount);
        if (lookingForCount) query.lookingForCount = lookingForCount === "more than 5" ? { $gt: 5 } : parseInt(lookingForCount);
        if (distance) query.distance = { $lte: parseFloat(distance) };
        if (price) query.price = { $lte: parseFloat(price) };

        const searchedListings = await CommunitiyModel.find(query);

        if (searchedListings.length === 0) {
            return res.status(200).json({ noResults: "No results found for the selected search criteria." });
        }

       return res.status(200).json({searchedListings: searchedListings});
    } catch (error) {
        console.error("Error fetching communities:", error);
        res.status(500).json({ message: "Error fetching communities" });
    }
};

const addCommunitySearchHistory = async (req, res) => {
    try {
        const { userId, roomsCount, bathroomCount, lookingForCount, distance, price } = req.body;
        const user = await UserDetails.findById(userId);

       

        // Directly update the communitySearchHistory object
        user.communitySearchHistory = {
            roomsCount,
            bathroomCount,
            lookingForCount,
            distance,
            price
        };

        await user.save();
        console.log("Searched history updated successfully");
        
        return res.status(200).json({ communitySearchedHistory: "Community Searched history updated successfully" });
    } catch (error) {
        console.error("Error adding search history:", error);
        res.status(500).json({ error: "Error adding search history" });
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
            return res.status(200).json({ AlreadyAdded: "You have already reviewed this listing" });
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


const getCommunitiesById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await CommunitiyModel.findById(id);
        return res.json(data);
    } catch (error) {
        console.log(error);
    }
};


const sendMatchedListingsEmail = async (req, res) => {
    try {
        const users = await UserDetails.find(); // Get all users

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        for (const user of users) {
            if (!user.communitySearchHistory || (user.communitySearchHistory.roomsCount === "" && 
                user.communitySearchHistory.bathroomCount === "" && user.communitySearchHistory.lookingForCount === "" && 
                user.communitySearchHistory.distance === "" && user.communitySearchHistory.price === "")) continue; 

            const { roomsCount, bathroomCount, lookingForCount, distance, price } = user.communitySearchHistory;

            const query = {};

            if (roomsCount) query.roomsCount = roomsCount === "more than 5" ? { $gt: "5" } : roomsCount;
            if (bathroomCount) query.bathroomCount = bathroomCount === "more than 5" ? { $gt: "5" } : bathroomCount;
            if (lookingForCount) query.lookingForCount = lookingForCount === "more than 5" ? { $gt: "5" } : lookingForCount;
            if (distance) query.distance = { $lte: distance };
            if (price) query.price = { $lte: price };

            const matchedListings = await CommunitiyModel.find(query);
            

            if (matchedListings.length > 0 ) {
                console.log("Sending email for user:", user.email, query);


                const listingsHtml = matchedListings
                    .map(
                        (listing) => `
    <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 20px;">
        <div style="flex: 0 0 auto; text-align: center;">
            <h3>${listing.community}</h3>
            ${
                listing.houseImage
                    ? `<img src="${listing.houseImage}" alt="House Image" style="width: 100px; height: 100px; border-radius: 2px;"/>`
                    : ""
            }
        </div>
        <div style="flex: 1; padding: 5px; background-color: #f9f9f9; border-radius: 2px; margin-left: 10px;">
        
            <p styles="margin: 0px;"><strong>Location:</strong> ${listing?.location[0]?.placeDescription || "N/A"}</p>
            <p style="margin: 0px;"><strong>Price:</strong> ${listing?.price}$</p>
            <div style="display: flex; align-items: center; justify-content: center; gap: 5px;">
    <p style="margin: 0;"> ${
        listing?.reviews?.length > 0
            ? (listing.reviews.reduce((sum, review) => sum + review.rating, 0) /
            listing.reviews.length).toFixed(1)
            : "No ratings"
    }</p>
    <p> </p>
    <p style="margin: 0;"> - ${ listing?.reviews?.length > 0 && (listing.reviews.length) } </p>
</div>

            <p style="margin: 0px;"><strong>Rooms:</strong>${listing?.roomsCount}</p>
        </div>
    </div>
`
                    )
                    .join("");

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: "Matched Communities Based on Your Search History",
                    html: `
                        <h2>We found some communities that match your search criteria:</h2>
                        ${listingsHtml}
                    `,
                };

                await transporter.sendMail(mailOptions);
            }
        }
        console.log("Emails sent with matched communities for each user.");

    } catch (error) {
        console.error("Error checking for matched communities:", error);
    }
};


cron.schedule("*/50 * * * * *", () => {
    console.log("Emails sent with matched Communities for each user.");
    //sendMatchedListingsEmail();
});


module.exports = {getCommunities, getCommunitiesBySearch, addCommunitySearchHistory, addReview, getCommunitiesById};