const Blog = require("../models/Blog");

exports.getSitemap = async (req, res) => {
    try {
        const baseUrl = "https://www.holsolindia.com";

        // 🟢 Static pages
        const staticPages = [
            "/",
            "/about",
            "/service-detail",
            "/product-detail",
            "/career",
            "/solar-calculator",
            "/contact",
            "/warranty-policy",
            "/privacy-policy",
            "/terms",
            "/usage-policy",

        ];

        // 🟢 Fetch blogs dynamically
        const blogs = await Blog.find().select("slug updatedAt");

        const blogUrls = blogs
            .map((blog) => {
                return `
  <url>
    <loc>${baseUrl}/blog-detail/${blog.slug}</loc>
    <lastmod>${blog.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
            })
            .join("");

        // 🟢 Static URLs
        const staticUrls = staticPages
            .map((page) => {
                return `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page === "/" ? "1.0" : "0.7"}</priority>
  </url>`;
            })
            .join("");

        // 🟢 Final sitemap XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${blogUrls}
</urlset>`;

        res.header("Content-Type", "application/xml");
        res.send(sitemap);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Sitemap generation failed",
            error: error.message,
        });
    }
};