const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: String,
    city: String,
    solarCapacity: String,

    status: {
      type: String,
      enum: [
        "Solar Order Received",
        "Technician Assigned",
        "Installation In Progress",
        "Installation Completed",
        "Delivered",
      ],
      default: "Solar Order Received",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
