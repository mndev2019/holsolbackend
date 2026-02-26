// website user register

const mongoose = require("mongoose");

const webUserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        otp: String,
        otpExpire: Date,
        isOtpVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("WebUser", webUserSchema);
