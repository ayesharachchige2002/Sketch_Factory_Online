const mongoose = require("mongoose");

const MachineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["Running", "Idle", "Maintenance"],
    default: "Idle",
  },
  lastMaintenance: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Machine", MachineSchema);
