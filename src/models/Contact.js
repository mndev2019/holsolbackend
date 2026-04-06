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
    timestamps: true
  }
);

// ✅ performance improvement
contactSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Contact", contactSchema);