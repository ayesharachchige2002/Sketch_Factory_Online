const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  migrateApprovedOrders,
} = require("../controllers/productionController");

// Get all production orders
router.get("/orders", getAllOrders);

// Create a new production order
router.post("/orders", createOrder);

// Update an existing production order
router.put("/orders/:id", updateOrder);

// Delete a production order
router.delete("/orders/:id", deleteOrder);

// ✅ Migrate Approved Orders from orders collection
router.post("/migrate-approved", migrateApprovedOrders);

module.exports = router;
