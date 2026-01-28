const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // ✅ member name
      trim: true,
    },
    designation: {
      type: String,
      required: true, // ✅ role / position
      trim: true,
    },
    image: {
      type: String,
      required: true, // ✅ image URL
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model("Team", teamSchema);
