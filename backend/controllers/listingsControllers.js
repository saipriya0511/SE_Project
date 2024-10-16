const Listings = require("../Models/ListingsModel");

async function addListing(req, res) {
  const {
    community,
    location,
    roomsCount,
    houseArea,
    houseWidth,
    BathRoomCount,
    lookingForCount,
    description,
  } = req.body;

  try {
    if (
      !community ||
      !location ||
      !roomsCount ||
      !houseArea ||
      !houseWidth ||
      !BathRoomCount ||
      !lookingForCount ||
      !description
    ) {
      return res
        .status(200)
        .json({ EnterAllDetails: "Please fill all the fields" });
    }

    const data = new Listings({
      community,
      location,
      roomsCount,
      description,
      houseArea,
      houseWidth,
      BathRoomCount,
      lookingForCount,
    });
    const d = await data.save();
    if(d) {
      return res.status(200).json({ Added: "Listing added successfully" });
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