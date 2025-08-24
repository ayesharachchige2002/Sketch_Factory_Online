const mongoose = require("mongoose");

const ProductionOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  product: String,
  quantity: Number,
  unitsCompleted: Number,
  deadline: Date,
  status: {
    type: String,
    enum: ["In Progress", "Completed", "Delayed"],
    default: "In Progress",
  },
});

module.exports = mongoose.model("ProductionOrder", ProductionOrderSchema);
