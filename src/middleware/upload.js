const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // 👈 path dhyaan se

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "holsol",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;