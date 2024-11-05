const Listings = require("../Models/ListingsModel");

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