const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        otp: {
            type: String,
        },
        otpExpiresAt: {
            type: Date,
        },
        houseSearchHistory: {
            roomsCount: {
                type: String,
            },
            bathroomCount: {
                type: String,
            },
            lookingForCount: {
                type: String,
            },
            distance: {
                type: String,
            },
            price: {
                type: String,
            },
        },
        communitySearchHistory: {
            roomsCount: {
                type: String,
            },
            bathroomCount: {
                type: String,
            },
            lookingForCount: {
                type: String,
            },
            distance: {
                type: String,
            },
            price: {
                type: String,
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
