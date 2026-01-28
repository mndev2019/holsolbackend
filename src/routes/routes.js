const express = require("express");
const router = express.Router();
// const {login} = require("../controllers/auth.controller");


//auth routes

// router.post("/api/login", login);

const upload = require("../config/multer");
const {
  createPopup,
  getPopups,
  updatePopup,
  deletePopup
} = require("../controllers/popup.controller");
const { createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");

const {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog.controller");

const {
  createTeam,
  getTeam,
  updateTeam,
  deleteTeam,
} = require("../controllers/team.controller");

const {
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contact.controller");
const  { login } = require("../controllers/auth.controller");

//login api
router.post("/api/login", login);

// popup routes
router.post("/api/popup", upload.single("image"), createPopup);
router.get("/api/popup", getPopups);
router.put("/api/popup/:id", upload.single("image"), updatePopup);
router.delete("/api/popup/:id", deletePopup);

//product routes 
router.post("/api/product", upload.single("image"), createProduct);
router.get("/api/product", getProducts);
router.put("/api/product/:id", upload.single("image"), updateProduct);
router.delete("/api/product/:id", deleteProduct);

//blog routes 
router.post("/api/blog", upload.single("image"), createBlog);
router.get("/api/blog", getBlogs);
router.put("/api/blog/:id", upload.single("image"), updateBlog);
router.delete("/api/blog/:id", deleteBlog);

// team routes
router.post("/api/team", upload.single("image"), createTeam);
router.get("/api/team", getTeam);
router.put("/api/team/:id", upload.single("image"), updateTeam);
router.delete("/api/team/:id", deleteTeam);

//contact routes
router.post("/api/contact", createContact);
router.get("/api/contact", getContact);
router.put("/api/contact/:id", updateContact);
router.delete("/api/contact/:id", deleteContact);



module.exports = router;
