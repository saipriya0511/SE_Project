const mongoose = require("mongoose");



const ListingSchema = new mongoose.Schema(
  {
    community: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);