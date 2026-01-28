const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true // createdAt & updatedAt
  }
);

module.exports = mongoose.model("Contact", contactSchema);
