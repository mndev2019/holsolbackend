const Enquiry = require("../models/Enquiry");
const sendEmail = require("../config/email");
const axios = require("axios");






exports.createEnquiry = async (req, res) => {
  try {
    const { name, mobile, state, city, pincode } = req.body;

    if (!name || !mobile || !state || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 1️⃣ Save to DB
    const enquiry = await Enquiry.create({
      name,
      mobile,
      state,
      city,
      pincode,
    });

    // 2️⃣ Send Email via Brevo
    await sendEmail({
      sender: {
        name: "Holsol India",
        email: process.env.MAIL_FROM,
      },
      to: [
        { email: "info@ramot.cloud" },
        { email: "info@holsolindia.com" },
      ],
      subject: "New Enquiry Received",
      htmlContent: `
        <h2>New Enquiry Details</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>State:</b> ${state}</p>
        <p><b>City:</b> ${city}</p>
        <p><b>Pincode:</b> ${pincode}</p>
      `,
    });

    // 3️⃣ Push Lead to LeadSquared
    const leadSquaredURL = `${process.env.LEADSQUARED_HOST}/v2/LeadManagement.svc/Lead.Capture?accessKey=${process.env.LEADSQUARED_ACCESS_KEY}&secretKey=${process.env.LEADSQUARED_SECRET_KEY}`;

    const leadPayload = [
      { Attribute: "FirstName", Value: name },
      { Attribute: "Mobile", Value: mobile },
      { Attribute: "State", Value: state },
      { Attribute: "City", Value: city },
      { Attribute: "PostalCode", Value: pincode },
      { Attribute: "Source", Value: "Website Popup Form" }
    ];
console.log("LeadSquared URL:", leadSquaredURL);
    await axios.post(leadSquaredURL, leadPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted",
      data: enquiry,
    });

  } 
  catch (error) {
    console.error("LeadSquared Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
 
};


// ✅ Get all Enquiries
exports.getEnquiry = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(); // ✅ faster

    res.status(200).json({
      success: true,
      data: enquiries,
      page,
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
