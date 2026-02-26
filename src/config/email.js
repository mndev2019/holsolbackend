// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // your email
//     pass: process.env.EMAIL_PASS, // app password
//   },
// });

// module.exports = transporter;

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // Must be false for port 587
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     // This prevents the connection from dropping on cloud hosting
//     rejectUnauthorized: false,
//     minVersion: "TLSv1.2"
//   }
// });

// // Verify connection configuration immediately on start
// transporter.verify((error, success) => {
//   if (error) {
//     console.log("Transporter config error:", error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

// module.exports = transporter;

// otp send via brevo

const axios = require("axios");

const sendEmail = async (data) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("BREVO ERROR:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = sendEmail;
