const ActivityLog = require("../models/ActivityLog");

async function logActivity({ type = "info", message, user = "System" }) {
  try {
    const log = new ActivityLog({ type, message, user });
    await log.save();
    console.log("✅ Activity logged:", message);
  } catch (err) {
    console.error("❌ Failed to log activity:", err.message);
  }
}

module.exports = logActivity;
