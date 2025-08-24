const express = require("express");
const router = express.Router();
const Delivery = require("../models/Delivery");

// Get all deliveries
router.get("/", async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new delivery
router.post("/", async (req, res) => {
  try {
    const newDelivery = new Delivery(req.body);
    const saved = await newDelivery.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update delivery status
router.patch("/:id/status", async (req, res) => {
  try {
    const updated = await Delivery.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus: req.body.deliveryStatus },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
