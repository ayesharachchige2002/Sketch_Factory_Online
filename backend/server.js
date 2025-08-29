
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productionRoutes = require('./routes/production');
const machineRoutes = require("./routes/machine");
const chartOverviewAPI = require( "./routes/chartOverviewAPI");
const orderRoutes = require("./routes/orders");
const activityLogRoutes = require("./routes/activityLogs");
const deliveryRoutes = require("./routes/delivery");



require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/production', productionRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/chartOverviewAPI", chartOverviewAPI);
app.use("/api/orders", orderRoutes);
app.use("/api/activityLogs", activityLogRoutes);
app.use("/api/delivery", deliveryRoutes);






// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error(err));

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
