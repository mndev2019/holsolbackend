const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./src/models/User");

(async () => {
  try {
    // DB connect
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    const hash = await bcrypt.hash("holsol@123", 10);

    await User.create({
      email: "info@holsolindia.com",
      password: hash,
    });

    console.log("Admin created successfully ✅");
    process.exit();
  } catch (error) {
    console.error("Error creating admin ❌", error);
    process.exit(1);
  }
})();
