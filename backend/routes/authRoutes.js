const express = require("express");
const { SigUp, Login, getUserName } = require("../Controllers/AuthenticationController");
const router = express.Router();


router.post("/signup", SigUp);

router.post("/login", Login);

router.get("/get-username/:userId", getUserName);


 
module.exports = router;