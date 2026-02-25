require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

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

app.use(mainroutes)


// DB Connection
connectDB();

// Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const PORT = process.env.PORT || 5000;

// Add '0.0.0.0' as the second argument
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


