const Blog = require("../models/Blog");
const cloudinary = require("cloudinary").v2;

//
// ✅ CREATE BLOG
//
exports.createBlog = async (req, res) => {
  try {
    const { title, shortDescription, description } = req.body;

    if (!title || !shortDescription || !description || !req.file) {
      return res.status(400).json({
        success: false,
        message: "All fields and image are required",
      });
    }

    const blog = await Blog.create({
      title,
      shortDescription,
      description,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//
// ✅ GET ALL BLOGS
//
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//
// ✅ GET SINGLE BLOG (BY SLUG)
//
exports.getSingleBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const blog = await Blog.findOne({ slug }).lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//
// ✅ UPDATE BLOG
//
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, shortDescription, description } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // 🔥 If new image uploaded
    if (req.file) {
      // delete old image from Cloudinary
      if (blog.image?.public_id) {
        await cloudinary.uploader.destroy(blog.image.public_id);
      }

      // assign new image
      blog.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    // update fields
    if (title) blog.title = title;
    if (shortDescription) blog.shortDescription = shortDescription;
    if (description) blog.description = description;

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//
// ✅ DELETE BLOG
//
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // 🔥 delete image from Cloudinary
    if (blog.image?.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};