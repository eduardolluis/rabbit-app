const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @router GET /api/admin/users
// @desc Get all users as admin only
// @access private

router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Internal Errors" });
  }
});

// @route POST /api/admin/users
// @desc add a new users
// @access private/admin

router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });

    await user.save();
    res.status(201).json({ message: "User created successfully   " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Internal Error" });
  }
});

// @route PUT /api/admin/users/:id
// @desc Update user information (only admin) - email, name, role
// @access private

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("user", "name");
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
    }

    const updatedUser = await user.save();
    res.json({ message: "User uploaded successfully", user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Internal Error" });
  }
});

// @route DELETE /api/admin/users/:id
// @desc Delete  a user
// @access Private (admin)

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Internal Error" });
  }
});

module.exports = router;
