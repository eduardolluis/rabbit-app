const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @ROUTE get /api/admin/orders
// @desc get all orders
// @access private (admin only)

router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Internal Error" });
  }
});

// @route PUT /api/admin/orders/:id
// @desc update order status
// @access private (admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      order.isDelivered =
        req.body.status === "Delivered" ? true : order.isDelivered;
      order.deliveredAt =
        req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Internal Error" });
  }
});

// @route DELETE /api/admin/orders/:id
// @desc delete an order
// @access private (admin only)

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: "Order removed successfully" });
    } else {
      res.status(404).json({ message: "Order not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Internal Error" });
  }
});

module.exports = router;
