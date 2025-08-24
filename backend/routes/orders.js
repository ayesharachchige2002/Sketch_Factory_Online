const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const logActivity = require("../utils/logActivity");

// 📥 Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
/*
// ✅ Confirm an order
router.put("/:id/confirm", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Confirmed" },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to confirm order" });
  }
});

// ❌ Decline an order
router.put("/:id/decline", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Declined" },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to decline order" });
  }
});*/

router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming order:", req.body);

    const newOrder = new Order(req.body);
    await newOrder.save();

    // ✅ Log activity
    await logActivity({
      type: "success",
      message: `📝 Order #${newOrder._id} created`,
      user: req.user?.name || "System", // use req.user if auth middleware exists
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("❌ Error creating order:", err.message);
    res.status(400).json({ error: "Failed to create order" });
  }
});


// ✅ Update Order Status (Approve/Deny)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // expected: "Approved" or "Denied"
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});


module.exports = router;
