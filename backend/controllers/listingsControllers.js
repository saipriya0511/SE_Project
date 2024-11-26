const Listings = require("../Models/ListingsModel");
const axios = require("axios");
const S3 = require("../s3");

async function addListing(req, res) {
    try {
        const response = await S3.uploadFile(
            process.env.AWS_BUCKET_NAME,
            req.files.houseImage[0]
        );

        const {
            community,
            houseImage,
            location,
            placeId,
            placeDescription,
            lat,
            long,
            roomsCount,
            price,
            houseArea,
            houseWidth,
            bathroomCount,
            lookingForCount,
            description,
            distance,
        } = req.body;

        const loc = {
            placeId,
            placeDescription,
            lat,
            long,
        };

        if (
            !community ||
            !location ||
            !placeId ||
            !placeDescription ||
            !lat ||
            !long ||
            !roomsCount ||
            !price ||
            !houseArea ||
            !houseWidth ||
            !bathroomCount ||
            !lookingForCount ||
            !description ||
            !distance
        ) {
            return res.json({ error: "Please fill all the fields" });
        }

        const data = new Listings({
            community,
            houseImage: response.Location,
            location: loc,
            roomsCount,
            price,
            description,
            houseArea,
            houseWidth,
            bathroomCount,
            lookingForCount,
            distance,
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

const getAllListings = async (req, res) => {
    try {
        const data = await Listings.find();
        res.send(data);
    } catch (error) {
        console.log(error);
    }
};

const getListingById = async (req, res) => {
    try {
        const data = await Listings.findById(req.params.id);
        res.send(data);
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

        res.json(placeDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching data");
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
        res.status(500).json({ error: "Error adding search history" });
    }
};

const nodemailer = require("nodemailer");

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


            const isEmpty = (obj) => Object.keys(obj).length === 0;

            

            if (matchedListings.length > 0 ) {
                console.log("Sending email for user:", user.email, query);
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: "Matched Listings Based on Your Search History",
                    text: `We found some listings that match your search criteria:\n\n${matchedListings
                        .map(
                            (listing) =>
                                `Community: ${listing.community}\nPrice: ${listing.price}\nRooms: ${listing.roomsCount}\n\n`
                        )
                        .join("")}`,
                };

                // Send the email to the current user
                await transporter.sendMail(mailOptions);
            }
        }
        console.log("Emails sent with matched listings for each user.");

        return res.status(200).json({ message: "Emails sent with matched listings for each user." });
    } catch (error) {
        console.error("Error checking for matched listings:", error);
        res.status(500).json({ error: "Error checking for matched listings" });
    }
};

module.exports = {
    addListing,
    getAllListings,
    getListingById,
    getPlaceDetails,
};
