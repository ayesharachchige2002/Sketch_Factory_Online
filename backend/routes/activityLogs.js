const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");

// Get recent activities
router.get("/", async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(20); // Get latest 20 logs
    res.json(logs);
  } catch (err) {
    console.error("❌ Error fetching activity logs:", err.message);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

module.exports = router;
