const Profile = require("../models/Profile");

/**
 * CREATE PROFILE (WEBSITE USER)
 */
exports.createProfile = async (req, res) => {
    try {
        // ✅ ek user ki sirf ek profile
        const exists = await Profile.findOne({
            web_user_id: req.webUser._id,
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Profile already exists",
            });
        }

        // ✅ FILE PATHS (product API jaisa format)
        const panFile = req.files?.pan?.[0]?.filename
            ? `uploads/${req.files.pan[0].filename}`
            : "";

        const aadhaarFile = req.files?.aadhaar?.[0]?.filename
            ? `uploads/${req.files.aadhaar[0].filename}`
            : "";

        const electricityBillFile = req.files?.electricity_bill?.[0]?.filename
            ? `uploads/${req.files.electricity_bill[0].filename}`
            : "";

        const profile = await Profile.create({
            web_user_id: req.webUser._id,

            full_name: req.body.full_name,
            email: req.body.email,
            mobile: req.body.mobile,
            city: req.body.city,
            installation_address: req.body.installation_address,

            pan_file: panFile,
            aadhaar_file: aadhaarFile,
            electricity_bill_file: electricityBillFile,
        });

        res.status(201).json({
            success: true,
            message: "Profile created successfully",
            data: profile,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * WEBSITE USER – MY PROFILE
 */
exports.myProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({
            web_user_id: req.webUser._id,
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        res.json({
            success: true,
            data: profile,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * ADMIN – GET ALL PROFILES
 */
exports.getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate("web_user_id", "name email mobile")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: profiles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// update profile
exports.updateProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({
            web_user_id: req.webUser._id,
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        // ===== TEXT FIELDS =====
        profile.full_name =
            req.body.full_name || profile.full_name;

        profile.email =
            req.body.email || profile.email;

        profile.mobile =
            req.body.mobile || profile.mobile;

        profile.city =
            req.body.city || profile.city;

        profile.installation_address =
            req.body.installation_address || profile.installation_address;

        // ===== FILES (OPTIONAL) =====
        if (req.files?.pan?.[0]) {
            profile.pan_file = `uploads/${req.files.pan[0].filename}`;
        }

        if (req.files?.aadhaar?.[0]) {
            profile.aadhaar_file = `uploads/${req.files.aadhaar[0].filename}`;
        }

        if (req.files?.electricity_bill?.[0]) {
            profile.electricity_bill_file = `uploads/${req.files.electricity_bill[0].filename}`;
        }

        await profile.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: profile,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * ADMIN – UPDATE PROFILE STATUS
 */
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const profile = await Profile.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        res.json({
            success: true,
            message: "Status updated successfully",
            data: profile,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/**
 * ADMIN → UPLOAD DOCUMENT
 */
exports.uploadAdminDocument = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Document type & file required",
      });
    }

    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // 🔁 Replace same document type if already exists
    const index = profile.admin_documents.findIndex(
      (doc) => doc.type === type
    );

    if (index !== -1) {
      profile.admin_documents[index].file = `uploads/${req.file.filename}`;
      profile.admin_documents[index].uploadedAt = new Date();
    } else {
      profile.admin_documents.push({
        type,
        file: `uploads/${req.file.filename}`,
      });
    }

    await profile.save();

    res.json({
      success: true,
      message: "Document uploaded successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
