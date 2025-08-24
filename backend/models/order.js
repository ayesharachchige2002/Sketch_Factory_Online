const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  product: { type: String, required: true },
  materials: { type: String },
  designSketch: { type: String }, // URL to the sketch image
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Denied"], default: "Approved" },
  deadline: { type: Date },
  shippingAddress: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
