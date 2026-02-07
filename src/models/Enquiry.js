// models/Enquiry.js
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

module.exports = mongoose.model("Enquiry", enquirySchema);
