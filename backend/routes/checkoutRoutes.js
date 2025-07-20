const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    // Create new checkout session (AWAIT was missing!)
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });

    console.log(`Checkout created for user ${req.user._id}:`, newCheckout._id);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error Creating checkout Session:", error);
    res
      .status(500)
      .json({ message: "Server Internal Error", error: error.message });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    // Find checkout and verify ownership
    const checkout = await Checkout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!checkout) {
      return res
        .status(404)
        .json({ message: "Checkout not found or unauthorized" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = new Date();

      await checkout.save();
      console.log(`Checkout ${checkout._id} marked as paid`);
      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
    res
      .status(500)
      .json({ message: "Server Internal Error", error: error.message });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to order after payment confirmation
// @access private
// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to order after payment confirmation
// @access private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    // Find checkout and verify ownership
    const checkout = await Checkout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!checkout) {
      return res
        .status(404)
        .json({ message: "Checkout not found or unauthorized" });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      // Validar que shippingAddress tiene todos los campos requeridos
      const { address, city, postalCode, country } = checkout.shippingAddress;
      if (!address || !city || !postalCode || !country) {
        return res.status(400).json({
          message: "Missing required shipping address fields",
          required: ["address", "city", "postalCode", "country"],
          received: checkout.shippingAddress,
        });
      }

      // Transformar checkoutItems para que coincidan con el schema de Order
      const orderItems = await Promise.all(
        checkout.checkoutItems.map(async (item) => {
          console.log("Processing checkout item:", item);

          // Validar campos requeridos del item
          if (!item.name || !item.image || !item.price) {
            throw new Error(
              `Missing required fields in item: ${JSON.stringify(item)}`
            );
          }

          let productId;

          // Si el item ya tiene productId, úsalo
          if (item.productId) {
            productId = item.productId;
          } else if (item.product) {
            productId = item.product;
          } else {
            // Buscar el producto por nombre como último recurso
            const product = await Product.findOne({ name: item.name });
            if (!product) {
              throw new Error(`Product not found: ${item.name}`);
            }
            productId = product._id;
          }

          return {
            product: productId, // Referencia al producto
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity || 1, // Asegurar que quantity existe
            size: item.size || "",
            color: item.color || "",
          };
        })
      );

      console.log("Transformed orderItems:", orderItems);

      // Create final order based on the checkout details
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: orderItems,
        shippingAddress: {
          address: checkout.shippingAddress.address,
          city: checkout.shippingAddress.city,
          postalCode: checkout.shippingAddress.postalCode,
          country: checkout.shippingAddress.country,
        },
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
      });

      // Mark the checkout as finalized
      checkout.isFinalized = true;
      checkout.finalizedAt = new Date();
      await checkout.save();

      // Delete the cart associated with the user
      await Cart.findOneAndDelete({ user: checkout.user });

      console.log(
        `Checkout ${checkout._id} finalized, Order ${finalOrder._id} created`
      );
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "Checkout already finalized" });
    } else {
      res.status(400).json({ message: "Checkout is not paid" });
    }
  } catch (error) {
    console.error("Error finalizing checkout:", error);

    // Más detalles del error para debugging
    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));
      return res.status(400).json({
        message: "Order validation failed",
        errors: validationErrors,
        received: error.errors,
      });
    }

    res.status(500).json({
      message: "Server Internal Error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

module.exports = router;
