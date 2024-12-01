const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema(
    {
        community: {
            type: String,
        },
        houseImage: {
            type: String,
        },
        location: {
            type: [
                {
                    placeId: {
                        type: String,
                    },
                    placeDescription: {
                        type: String,
                    },
                    lat: {
                        type: Number,
                    },
                    long: {
                        type: Number,
                    },
                },
            ],
        },
        roomsCount: {
            type: Number,
        },
        price: {
            type: Number,
        },
        houseArea: {
            type: String,
        },
        houseWidth: {
            type: String,
        },
        bathroomCount: {
            type: Number,
        },
        lookingForCount: {
            type: Number,
        },
        description: {
            type: String,
        },
        distance: {
            type: Number,
        },

        reviews: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            rating: {
                type: Number,
            },
            feedback: {
                type: String,
            }
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Community", CommunitySchema);
