const mongoose = require("mongoose");

const popupSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // ✅ createdAt & updatedAt auto add
  }
);

module.exports = mongoose.model("Popup", popupSchema);
