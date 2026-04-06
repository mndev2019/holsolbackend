const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: String,
    mobile: String,
    state: String,
    city: String,
    pincode: String,
  },
  { timestamps: true }
);

// ✅ performance boost
enquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Enquiry", enquirySchema);