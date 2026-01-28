const fs = require("fs");
const path = require("path");
const Blog = require("../models/Blog");

// ✅ Create blog
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
            image: req.file.filename,
        });

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: {
                ...blog._doc,
                image: `uploads/${blog.image}`,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ Get all blogs
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });

        const updatedBlogs = blogs.map(blog => ({
            ...blog._doc,
            image: `uploads/${blog.image}`,
        }));

        res.status(200).json({
            success: true,
            data: updatedBlogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ Update blog
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

        // 🔥 delete old image if new uploaded
        if (req.file) {
            const oldImagePath = path.join(process.cwd(), "uploads", blog.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            blog.image = req.file.filename;
        }

        if (title) blog.title = title;
        if (shortDescription) blog.shortDescription = shortDescription;
        if (description) blog.description = description;

        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: {
                ...blog._doc,
                image: `uploads/${blog.image}`,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ Delete blog (image bhi delete hogi)
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

        // const imagePath = path.join(process.cwd(), "uploads", blog.image);
        // if (fs.existsSync(imagePath)) {
        //     fs.unlinkSync(imagePath);
        // }
        if (blog.image) {
            const filename = blog.image.includes("/")
                ? blog.image.split("/").pop()
                : blog.image;

            const imagePath = path.join(process.cwd(), "uploads", filename);

            fs.existsSync(imagePath) && fs.unlinkSync(imagePath);
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
