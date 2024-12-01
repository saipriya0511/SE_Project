const Schema = require("../Models/AuthenticationModel.js");
const nodemailer = require("nodemailer");

async function SigUp(req, res) {
  try {
    const { name, email, password } = req.body;

    const isUserExist = await Schema.findOne({ email: email });

    if (isUserExist) {
      return res.status(200).json({ AlreadyExist: "Account already exists" });
    }

    if (!name || !email || !password) {
      return res
        .status(200)
        .json({ EnterAllDetails: "Please fill all the fields" });
    }

    const data = new Schema({
      name,
      email,
      password,
      otp: "",
      otpExpiresAt: "",
      houseSearchHistory: {
        roomsCount: 0,
        bathroomCount: 0,
        lookingForCount: 0,
        distance: 0,
        price: 0
      },
      communitySearchHistory: {
        roomsCount: 0,
        bathroomCount: 0,
        lookingForCount: 0,
        distance: 0,
        price: 0
      },
    });

    const d = await data.save();
    return res.json(d);
  } catch (error) {
    console.log(error);
  }
}

async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(200)
        .json({ EnterAllDetails: "Please fill all the fields" });
    }

    const isUserExist = await Schema.findOne({ email: email });
    if (!isUserExist) {
      return res.status(200).json({ NotExist: "User does not exist" });
    }

    if (password !== isUserExist.password) {
      return res.status(200).json({ Incorrect: "Incorrect password" });
    }

    return res.json(isUserExist);
  } catch (error) {
    console.log(error);
  }
}

async function getUserName(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(200)
        .json({ EnterAllDetails: "Please fill all the fields" });
    }

    const isUserExist = await Schema.findOne({ _id: userId });
    if (!isUserExist) {
      return res.status(200).json({ NotExist: "User does not exist" });
    }
    return res.json({ userName: isUserExist.name });
  } catch (error) {
    console.log(error);
  }
}



module.exports = {
  SigUp,
  Login,
  getUserName,
};
