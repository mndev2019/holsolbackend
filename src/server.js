require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
// const authRoutes = require("./routes/auth.routes");
const mainroutes = require("./routes/routes")
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// Routes
// app.use("/api/auth", authRoutes);
app.use(mainroutes)

// DB Connection
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});