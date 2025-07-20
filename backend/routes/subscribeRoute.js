const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Suscribe");

// @route POST /api/subscribe
// @desc Handle newsletter subscription
// @access public

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Not Email Provided" });
  }

  try {
    // check if email is already subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: "Email is already Subscribed" });
    }

    // Create a new subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();

    res
      .status(201)
      .json({ message: "Successfully subscribed  to the newsletter!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Interal Error" });
  }
});

module.exports = router;
