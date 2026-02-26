const WebUser = require("../models/WebUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/email");


// ================= REGISTER =================
exports.registerWebUser = async (req, res) => {
    try {
        const { name, mobile, email, address, city, password } = req.body;

        if (!name || !mobile || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, mobile, email & password required",
            });
        }

        const existingUser = await WebUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await WebUser.create({
            name,
            mobile,
            email,
            address,
            city,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET ALL WEBSITE USERS =================
exports.getAllWebUsers = async (req, res) => {
    try {
        const users = await WebUser.find().select("-password");

        res.status(200).json({
            success: true,
            total: users.length,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// ================= LOGIN =================
exports.loginWebUser = async (req, res) => {
    console.log("LOGIN API HIT", req.body);

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email & password required",
            });
        }

        const user = await WebUser.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { id: user._id, type: "webUser" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await WebUser.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // 🔢 Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     user.otp = otp;
//     user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min
//     await user.save();

//     // 📧 MAIL
//     const mailOptions = {
//       from: `"Holsol Solar" <${process.env.MAIL_USER}>`,
//       to: email,
//       subject: "🔐 Password Reset OTP - Holsol",
//       html: `
//         <div style="font-family: Arial; padding:20px">
//           <h2 style="color:#0047FF">Holsol Password Reset</h2>
//           <p>Your OTP is:</p>
//           <h1 style="letter-spacing:4px">${otp}</h1>
//           <p>This OTP is valid for 5 minutes.</p>
//           <p style="color:#888">Do not share this code with anyone.</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({
//       success: true,
//       message: "OTP sent to your email",
//     });

//   } catch (error) {
//     console.log("FORGOT PASSWORD ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await WebUser.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.isOtpVerified = false;

    await user.save();

    // 📧 Send Email using Brevo API
    await sendEmail({
      sender: {
        name: "Holsol Solar",
        email: process.env.MAIL_FROM,
      },
      to: [
        {
          email: email,
        },
      ],
      subject: "🔐 Password Reset OTP - Holsol",
      htmlContent: `
        <div style="font-family: Arial; padding:20px">
          <h2 style="color:#0047FF">Holsol Password Reset</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
          <p style="color:#888">Do not share this code with anyone.</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });

  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// exports.verifyOtp = async (req, res) => {
//     try {
//         const { email, otp } = req.body;

//         const user = await WebUser.findOne({ email });
//         if (!user) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         // ❌ OTP mismatch
//         if (user.otp !== otp.toString()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid OTP",
//             });
//         }

//         // ⏰ OTP expired
//         if (user.otpExpire < Date.now()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "OTP expired",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "OTP verified successfully",
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await WebUser.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // ⏰ Check Expiry First
    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // ❌ OTP mismatch
    if (user.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ Mark verified
    user.isOtpVerified = true;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// exports.resetPassword = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await WebUser.findOne({ email });
//         if (!user) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         user.password = hashedPassword;
//         user.otp = null;
//         user.otpExpire = null;

//         await user.save();

//         res.status(200).json({
//             success: true,
//             message: "Password reset successfully",
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await WebUser.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔒 Check if OTP verified
    if (!user.isOtpVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP not verified",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.isOtpVerified = false; // reset flag

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
