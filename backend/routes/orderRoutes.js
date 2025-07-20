const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/orders
// @desc Get orders (all for admin, user's orders for regular users)
// @access Private
router.get("/", protect, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    let orders;

    // If user is admin, fetch all orders; otherwise, fetch user's orders only
    if (req.user.role === "admin") {
      console.log("Admin fetching all orders");
      orders = await Order.find({})
        .sort({ createdAt: -1 })
        .populate("user", "name email")
        .populate("orderItems.product", "name images price");
    } else {
      console.log("Fetching orders for user:", req.user._id);
      orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("orderItems.product", "name images price");
    }

    console.log(`Found ${orders.length} orders`);

    res.json(orders);
  } catch (err) {
    console.error("Error in / route:", err);
    res.status(500).json({
      message: "Server Internal Error",
      error: err.message,
    });
  }
});

// @route GET /api/orders/admin/all
// @desc Get ALL orders for admin panel
// @access Private/Admin
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    console.log("Admin fetching all orders");
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("orderItems.product", "name images price");

    console.log(`Found ${orders.length} total orders for admin`);

    res.json({
      success: true,
      orders: orders,
      totalOrders: orders.length,
    });
  } catch (err) {
    console.error("Error in /admin/all route:", err);
    res.status(500).json({
      message: "Server Internal Error",
      error: err.message,
    });
  }
});

// @route GET /api/orders/my-orders
// @desc Logged-in user's orders (alternative endpoint)
// @access Private
router.get("/my-orders", protect, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log("Fetching orders for user:", req.user._id);
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("orderItems.product", "name images price");

    console.log(`Found ${orders.length} orders for user ${req.user._id}`);

    res.json({
      success: true,
      orders: orders,
      totalOrders: orders.length,
    });
  } catch (err) {
    console.error("Error in /my-orders:", err);
    res.status(500).json({
      message: "Server Internal Error",
      error: err.message,
    });
  }
});

// @route POST /api/orders
// @desc Create new order
// @access Private
router.post("/", protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    console.log("Order created:", createdOrder._id);

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Server Internal Error",
      error: error.message,
    });
  }
});

// @route GET /api/orders/:id
// @desc Get order details by ID
// @access Private
router.get("/:id", protect, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name images price");

    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }

    // Allow admin to view any order, otherwise check ownership
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error in /:id route:", error);
    res.status(500).json({
      message: "Server Internal Error",
      error: error.message,
    });
  }
});

// @route PUT /api/orders/:id/status
// @desc Update order status (Admin only)
// @access Private/Admin
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    console.log("=== DEBUG INFO ===");
    console.log("Order ID:", req.params.id);
    console.log("Request body:", req.body);

    const { status } = req.body;

    // Validar que el status sea válido (usando los valores con mayúsculas)
    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        validStatuses: validStatuses,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("Order found:", order._id);

    // Actualizar el status
    order.status = status;

    // Si el status es "Delivered", también marcar como entregado
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    // Si el status es "Cancelled", agregar fecha de cancelación
    if (status === "Cancelled") {
      order.cancelledAt = Date.now();
    }

    const updatedOrder = await order.save();

    console.log(`Order ${order._id} status updated to: ${status}`);

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      message: "Server Internal Error",
      error: error.message,
    });
  }
});

// @route PUT /api/orders/:id/pay
// @desc Update order to paid
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Allow admin to update any order, otherwise check ownership
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer
        ? req.body.payer.email_address
        : req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order payment:", error);
    res.status(500).json({
      message: "Server Interna Error",
      error: error.message,
    });
  }
});

// @route PUT /api/orders/:id/deliver
// @desc Update order to delivered (Admin only)
// @access Private/Admin
router.put("/:id/deliver", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order delivery:", error);
    res.status(500).json({
      message: "Server Internal Error",
      error: error.message,
    });
  }
});

// @route GET /api/orders/stats/summary
// @desc Get order statistics for admin dashboard
// @access Private/Admin
router.get("/stats/summary", protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const paidOrders = await Order.countDocuments({ isPaid: true });
    const deliveredOrders = await Order.countDocuments({ isDelivered: true });
    const pendingOrders = await Order.countDocuments({
      isPaid: false,
      isDelivered: false,
    });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      success: true,
      stats: {
        totalOrders,
        paidOrders,
        deliveredOrders,
        pendingOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({
      message: "Server Internal Error",
      error: error.message,
    });
  }
});

module.exports = router;
