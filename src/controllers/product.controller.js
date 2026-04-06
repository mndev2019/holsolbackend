const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");

// ✅ Create product
exports.createProduct = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !req.file) {
            return res.status(400).json({
                success: false,
                message: "Title and image are required",
            });
        }

        const product = await Product.create({
            title,
            image: req.file.filename,
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: {
                ...product._doc,
                image: `uploads/${product.image}`,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .lean();

        const updatedProducts = products.map(product => ({
            ...product,
            image: `uploads/${product.image}`,
        }));

        res.status(200).json({
            success: true,
            data: updatedProducts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ✅ Update product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // delete old image
        if (req.file && product.image) {
            const oldPath = path.join(process.cwd(), "uploads", product.image);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        if (title) product.title = title;
        if (req.file) product.image = req.file.filename;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: {
                ...product._doc,
                image: `uploads/${product.image}`,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ✅ Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const imagePath = path.join(process.cwd(), "uploads", product.image);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

