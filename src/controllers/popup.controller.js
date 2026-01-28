
const Popup = require("../models/Popup");
const fs = require("fs");
const path = require("path");

// ✅ Create popup
exports.createPopup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }

    const popup = await Popup.create({
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "Popup image uploaded",
      data: popup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get all popups
exports.getPopups = async (req, res) => {
  try {
    const popups = await Popup.find().sort({ createdAt: -1 });

    const updatedPopups = popups.map(popup => ({
      ...popup._doc,
      image: `uploads/${popup.image}`,
    }));

    res.status(200).json({
      success: true,
      data: updatedPopups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update popup
exports.updatePopup = async (req, res) => {
  try {
    const { id } = req.params;

    const popup = await Popup.findById(id);

    if (!popup) {
      return res.status(404).json({
        success: false,
        message: "Popup not found",
      });
    }

    // 🧹 delete old image if new uploaded
    if (req.file && popup.image) {
      const oldImagePath = path.join(process.cwd(), "uploads", popup.image);
      fs.existsSync(oldImagePath) && fs.unlinkSync(oldImagePath);

      popup.image = req.file.filename;
    }

    await popup.save();

    res.status(200).json({
      success: true,
      message: "Popup updated successfully",
      data: {
        ...popup._doc,
        image: `uploads/${popup.image}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Delete popup
exports.deletePopup = async (req, res) => {
  try {
    const { id } = req.params;

    const popup = await Popup.findByIdAndDelete(id);

    if (!popup) {
      return res.status(404).json({
        success: false,
        message: "Popup not found",
      });
    }

    if (popup.image) {
      const imagePath = path.join(process.cwd(), "uploads", popup.image);
      fs.existsSync(imagePath) && fs.unlinkSync(imagePath);
    }

    res.status(200).json({
      success: true,
      message: "Popup deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


