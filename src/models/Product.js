const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ VERY IMPORTANT (fix slow sorting)
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);