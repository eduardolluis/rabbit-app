const express = require("express");
const Products = require("../models/Product");
const { admin, protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/products
// @Desc get all products
// @access private (admin)

router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Products.find({});
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json;
  }
});

module.exports = router;
