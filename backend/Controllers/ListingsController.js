const Listings = require("../Models/ListingsModel");
const axios = require("axios");
const S3 = require("../s3");
const UserDetails = require("../Models/AuthenticationModel");

async function addListing(req, res) {
    try {
        const response = await S3.uploadFile(
            process.env.AWS_BUCKET_NAME,
            req.files.houseImage[0]
        );

        const { userId, community, houseImage, location, placeId, placeDescription, lat, long, roomsCount, price,
            houseArea, houseWidth, bathroomCount, lookingForCount, description, distance, } = req.body;

        const loc = {
            placeId,
            placeDescription,
            lat,
            long,
        };

        if ( !community || !location || !placeId || !placeDescription || !lat || !long || !roomsCount || 
            !price || !houseArea || !houseWidth || !bathroomCount || !lookingForCount || !description || !distance
        ) {
            return res.json({ error: "Please fill all the fields" });
        }

        const data = new Listings({ userId, community, houseImage: response.Location, location: loc,
            roomsCount, price, description, houseArea, houseWidth, bathroomCount, lookingForCount, distance,
        });
        const d = await data.save();
        if (d) {
            return res
                .status(200)
                .json({ Added: "Listing added successfully" });
        }
        return res.json(d);
    } catch (error) {
        console.log(error);
    }
}


const updateListing = async (req, res) => {
    try {
        const listingId = req.params.id;

        // Find the existing listing
        const existingListing = await Listings.findById(listingId);
        if (!existingListing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        // Handle file upload for house image
        let houseImage = existingListing.houseImage;
        if (req.files && req.files.houseImage && req.files.houseImage.length > 0) {
            const uploadedImage = await S3.uploadFile(
                process.env.AWS_BUCKET_NAME,
                req.files.houseImage[0]
            );
            houseImage = uploadedImage.Location;
        }

        const {
            community,
            placeId,
            placeDescription,
            lat,
            long,
            roomsCount,
            price,
            description,
            houseArea,
            houseWidth,
            bathroomCount,
            lookingForCount,
            distance
        } = req.body;

        // Construct location object
        const loc = {
            placeId: placeId || existingListing.location[0].placeId,
            placeDescription: placeDescription || existingListing.location[0].placeDescription,
            lat: lat || existingListing.location[0].lat,
            long: long || existingListing.location[0].long
        };

        // Create updated data object
        const updatedData = {
            community: community || existingListing.community,
            location: loc,
            houseImage, // Updated or existing image
            roomsCount: roomsCount || existingListing.roomsCount,
            price: price || existingListing.price,
            description: description || existingListing.description,
            houseArea: houseArea || existingListing.houseArea,
            houseWidth: houseWidth || existingListing.houseWidth,
            bathroomCount: bathroomCount || existingListing.bathroomCount,
            lookingForCount: lookingForCount || existingListing.lookingForCount,
            distance: distance || existingListing.distance
        };

        // Validate required fields (if necessary)
        if (!updatedData.community || !updatedData.roomsCount || !updatedData.price) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        // Update the listing
        const updatedListing = await Listings.findByIdAndUpdate(listingId, updatedData, { new: true });

        if (!updatedListing) {
            return res.status(500).json({ error: "Failed to update listing" });
        }

        return res.status(200).json({
            message: "Listing updated successfully",
            data: updatedListing
        });
    } catch (error) {
        console.error("Error updating listing:", error);
        return res.status(500).json({ error: "An error occurred while updating the listing" });
    }
};



const getAllListings = async (req, res) => {
    try {
        const data = await Listings.find();
        return res.send(data);
    } catch (error) {
        console.log(error);
    }
};

const getListingsBySearch = async (req, res) => {
    try {
        const { roomsCount, bathroomCount, lookingForCount, distance, price } = req.query;

        // Build query object dynamically based on provided filters
        const query = {};

        if (roomsCount) query.roomsCount = roomsCount === "more than 5" ? { $gt: 5 } : parseInt(roomsCount);
        if (bathroomCount) query.bathroomCount = bathroomCount === "more than 5" ? { $gt: 5 } : parseInt(bathroomCount);
        if (lookingForCount) query.lookingForCount = lookingForCount === "more than 5" ? { $gt: 5 } : parseInt(lookingForCount);
        if (distance) query.distance = { $lte: parseFloat(distance) };
        if (price) query.price = { $lte: parseFloat(price) };

        // If no filters are provided, return all listings
        if (Object.keys(query).length === 0) {
            const allListings = await Listings.find();
            return res.status(200).json({ allListings });
        }

        const searchedListings = await Listings.find(query);

        if (searchedListings.length === 0) {
            return res.status(200).json({ noResults: "No results found for the selected search criteria." });
        }

        return res.status(200).json({ searchedListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        return res.status(500).json({ message: "Error fetching listings" });
    }
};


const addHouseSearchHistory = async (req, res) => {
    try {
        const { userId, roomsCount, bathroomCount, lookingForCount, distance, price } = req.body;
        const user = await UserDetails.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }

        // Directly update the houseSearchHistory object
        user.houseSearchHistory = {
            roomsCount,
            bathroomCount,
            lookingForCount,
            distance,
            price
        };

        await user.save();
        console.log("Searched history updated successfully");
        
        return res.status(200).json({ searchedHistory: "Searched history updated successfully" });
    } catch (error) {
        console.error("Error adding search history:", error);
        return res.status(500).json({ error: "Error adding search history" });
    }
};


const getListingById = async (req, res) => {
    try {
        const data = await Listings.findById(req.params.id);
        return res.json(data);
        
    } catch (error) {
        console.log(error);
    }
};  

const getPlaceDetails = async (req, res) => {
    try {
        const { input, location, radius } = req.body;

        const autocompleteResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
            {
                params: {
                    input,
                    key: process.env.GOOGLE_MAPS_API_KEY,
                    ...(location && {
                        location: `${location.lat},${location.lng}`,
                    }),
                    ...(radius && { radius }),
                    types: "establishment",
                },
            }
        );

        const placeDetails = await Promise.all(
            autocompleteResponse.data.predictions.map(async (prediction) => {
                const detailsResponse = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/details/json`,
                    {
                        params: {
                            place_id: prediction.place_id,
                            key: process.env.GOOGLE_MAPS_API_KEY,
                        },
                    }
                );

                const { result } = detailsResponse.data;
                return {
                    description: prediction.description,
                    location: result.geometry.location,
                    place_id: prediction.place_id,
                };
            })
        );

        return res.json(placeDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error fetching data");
    }
};



const nodemailer = require("nodemailer");

const sendMatchedListingsEmail = async (req, res) => {
    try {
        const users = await UserDetails.find(); 

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        for (const user of users) {
            if (!user.houseSearchHistory || (user.houseSearchHistory.roomsCount === "" && 
                user.houseSearchHistory.bathroomCount === "" && user.houseSearchHistory.lookingForCount === "" && 
                user.houseSearchHistory.distance === "" && user.houseSearchHistory.price === "")) continue; 

            const { roomsCount, bathroomCount, lookingForCount, distance, price } = user.houseSearchHistory;

            const query = {};

            if (roomsCount) query.roomsCount = roomsCount === "more than 5" ? { $gt: "5" } : roomsCount;
            if (bathroomCount) query.bathroomCount = bathroomCount === "more than 5" ? { $gt: "5" } : bathroomCount;
            if (lookingForCount) query.lookingForCount = lookingForCount === "more than 5" ? { $gt: "5" } : lookingForCount;
            if (distance) query.distance = { $lte: distance };
            if (price) query.price = { $lte: price };

            const matchedListings = await Listings.find(query);
            

            if (matchedListings.length > 0 ) {
                console.log("Sending email for user:", user.email, query);
                const listingsHtml = matchedListings
                    .map((listing) => `
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

                    <p style="margin: 0px;"><strong>Rooms:</strong>${listing?.roomsCount}</p>
                </div>
                </div>`
            )
            .join("");

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: "Matched Listings",
                    html: `
                    <h2>Matched Listings</h2>
                    ${listingsHtml}
                    `,
                };

                await transporter.sendMail(mailOptions);
            }
        }
        console.log("Emails sent with matched listings for each user.");

    } catch (error) {
        console.error("Error checking for matched listings:", error);
    }
};



const cron = require("node-cron");
cron.schedule("*/50 * * * * *", () => {
    console.log("Emails sent with matched listings for each user.");
    //sendMatchedListingsEmail();
});


const getListingsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const listings = await Listings.find({ userId });
        return res.json(listings);
    } catch (error) {
        console.error("Error fetching listings:", error);
        return res.status(500).json({ message: "Error fetching listings" });
    }
};





module.exports = {
    addListing,
    getAllListings,
    getListingsBySearch,
    addHouseSearchHistory,
    getListingById,
    getPlaceDetails,
    sendMatchedListingsEmail,
    getListingsByUserId,
    updateListing
    
};
