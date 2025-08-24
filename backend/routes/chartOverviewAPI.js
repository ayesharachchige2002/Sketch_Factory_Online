const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// MongoDB Model for pChart
const productionSchema = new mongoose.Schema({
  taskId: String,
  orderName: String,
  unitsCompleted: Number,
  createdAt: {
    type: Date,
    required: true,
  },
});


const ProductionEntry = mongoose.model("pChart", productionSchema);

// API Route: Fetch Monthly Production Overview
router.get("/overview", async (req, res) => {
  try {
    const pipeline = [
      {
        $addFields: {
          createdAtDate: {
            $toDate: "$createdAt"
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAtDate" },
          totalUnits: { $sum: "$unitsCompleted" }
        }
      },
      { $sort: { "_id": 1 } }
    ];
    

    const result = await ProductionEntry.aggregate(pipeline);

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const formattedData = result.map((item) => ({
      month: monthNames[item._id - 1],
      totalUnits: item.totalUnits,
    }));

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching production overview:", err.message);
    res.status(500).json({ error: "Failed to fetch production data" });
  }
});

module.exports = router;
