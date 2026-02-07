const Enquiry = require("../models/Enquiry");
const transporter = require("../config/email");

// ✅ Create Enquiry
// exports.createEnquiry = async (req, res) => {
//   try {
//     const { name, mobile, state, city, pincode } = req.body;

//     if (!name || !mobile || !state || !city || !pincode) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const enquiry = await Enquiry.create({
//       name,
//       mobile,
//       state,
//       city,
//       pincode,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Enquiry submitted successfully",
//       data: enquiry,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
exports.createEnquiry = async (req, res) => {
  try {
    const { name, mobile, state, city, pincode } = req.body;

    if (!name || !mobile || !state || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const enquiry = await Enquiry.create({
      name,
      mobile,
      state,
      city,
      pincode,
    });

    // ✅ Email Content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ["info@ramot.cloud", "info@holsolindia.com"], // 👈 2 emails
      subject: "New Enquiry Received",
      html: `
        <h2>New Enquiry Details</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>State:</b> ${state}</p>
        <p><b>City:</b> ${city}</p>
        <p><b>Pincode:</b> ${pincode}</p>
      `,
    };

    // ✅ Send Email
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ Get all Enquiries
exports.getEnquiry = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Delete Enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
