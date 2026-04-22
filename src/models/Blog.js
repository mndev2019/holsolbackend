const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },

    // ✅ UPDATED IMAGE FIELD
    image: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },

    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });

blogSchema.pre("save", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});

module.exports = mongoose.model("Blog", blogSchema);