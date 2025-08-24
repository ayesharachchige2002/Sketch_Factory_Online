// models/Delivery.js (Node + Mongoose)
const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  address: { type: String, required: true },
  trackingNumber: { type: String },
  carrier: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Shipped", "In Transit", "Delivered"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Delivery", DeliverySchema);
