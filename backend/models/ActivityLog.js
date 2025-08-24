const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["success", "info", "warning", "error"],
      default: "info",
    },
    message: { type: String, required: true },
    user: { type: String, required: true }, // or user ID if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
