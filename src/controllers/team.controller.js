const fs = require("fs");
const path = require("path");
const Team = require("../models/Team");

// ✅ Create team member
exports.createTeam = async (req, res) => {
  try {
    const { name, designation } = req.body;

    if (!name || !designation || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Name, designation and image are required",
      });
    }

    const team = await Team.create({
      name,
      designation,
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      data: {
        ...team._doc,
        image: `uploads/${team.image}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get all team members
exports.getTeam = async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });

    const updatedTeam = team.map(member => ({
      ...member._doc,
      image: `uploads/${member.image}`,
    }));

    res.status(200).json({
      success: true,
      data: updatedTeam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update team member
exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation } = req.body;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // 🧹 old image delete if new image uploaded
    if (req.file && team.image) {
      const oldImagePath = path.join(process.cwd(), "uploads", team.image);

      fs.unlink(oldImagePath, err => {
        if (err) {
          console.error("Old image delete failed:", err);
        }
      });
    }

    // update fields
    if (name) team.name = name;
    if (designation) team.designation = designation;
    if (req.file) team.image = req.file.filename;

    await team.save();

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: {
        ...team._doc,
        image: `uploads/${team.image}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ Delete team member
exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findByIdAndDelete(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    const imagePath = path.join(process.cwd(), "uploads", team.image);

    fs.unlink(imagePath, err => {
      if (err) {
        console.error("Failed to delete image file:", err);
      }
    });

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
