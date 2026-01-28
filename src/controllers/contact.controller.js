const Contact = require("../models/Contact");

// ✅ Create contact
exports.createContact = async (req, res) => {
    try {
        const { phone, whatsapp, email } = req.body;

        if (!phone || !whatsapp || !email) {
            return res.status(400).json({
                success: false,
                message: "Phone, WhatsApp and Email are required",
            });
        }

        const contact = await Contact.create({
            phone,
            whatsapp,
            email,
        });

        res.status(201).json({
            success: true,
            message: "Contact created successfully",
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ Get contact (single)
exports.getContact = async (req, res) => {
    try {
        const contact = await Contact.findOne().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ Update contact
exports.updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { phone, whatsapp, email } = req.body;

        const updateData = {};
        if (phone) updateData.phone = phone;
        if (whatsapp) updateData.whatsapp = whatsapp;
        if (email) updateData.email = email;

        const contact = await Contact.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ Delete contact
exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
