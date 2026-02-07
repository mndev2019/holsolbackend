const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    web_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WebUser",
      required: true,
      unique: true, // 👈 ek user ek hi profile
    },

    full_name: String,
    email: String,
    mobile: String,
    city: String,
    installation_address: String,

    pan_file: String,
    aadhaar_file: String,
    electricity_bill_file: String,

    // 🔥 ADMIN UPLOADED DOCUMENTS
    admin_documents: [
      {
        type: {
          type: String,
          enum: [
            "insurance",
            "loyalty_card",
            "warranty",
            "bill",
            "subsidy",
            "certification",
          ],
          required: true,
        },
        file: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

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

module.exports = mongoose.model("Profile", profileSchema);
