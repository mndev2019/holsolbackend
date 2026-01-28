const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // ✅ title is required
    },
    image: {
      type: String,
      required: true, // ✅ image is required
    },
  },
  {
    timestamps: true, // ✅ createdAt & updatedAt auto add
  }
);

module.exports = mongoose.model("Product", productSchema);
