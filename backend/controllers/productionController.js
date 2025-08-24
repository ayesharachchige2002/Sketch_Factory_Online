const ProductionOrder = require("../models/productionOrder");
const Order = require("../models/order"); // <-- Add this model import

// Get all production orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await ProductionOrder.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new production order
exports.createOrder = async (req, res) => {
  try {
    const newOrder = new ProductionOrder(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await ProductionOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    await ProductionOrder.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.migrateApprovedOrders = async (req, res) => {
  try {
    const approvedOrders = await Order.find({ status: "Approved" });

    let migratedCount = 0;

    for (const order of approvedOrders) {
      const exists = await ProductionOrder.findOne({ orderId: order.orderId });

      if (!exists) {
        await ProductionOrder.create({
          orderId: order.orderId,
          product: order.product,
          quantity: order.quantity,
          deadline: order.deadline,
          unitsCompleted: 0,
          status: "In Progress",
        });
        migratedCount++;
      }
    }

    res.status(200).json({
      message: `${migratedCount} approved orders migrated successfully.`,
    });
  } catch (err) {
    console.error("Migration failed:", err);
    res.status(500).json({ error: "Migration failed." });
  }
};
