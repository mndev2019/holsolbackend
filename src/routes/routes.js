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
const { createEnquiry, getEnquiry, deleteEnquiry } = require("../controllers/enquiry.controller")

const { login } = require("../controllers/auth.controller");
const { registerWebUser, loginWebUser, forgotPassword, verifyOtp, resetPassword, getAllWebUsers } = require("../controllers/webuser.controller")

const profileController = require("../controllers/profile.controller");
const { isWebUser } = require("../middlewares/webAuth");



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

//enquiryform
router.post("/api/enquiry", createEnquiry);
router.get("/api/enquiry", getEnquiry);
router.delete("/api/enquiry/:id", deleteEnquiry);

//customer routes
// router.post("/api/customers", createCustomer);
// router.get("/api/customers", getAllCustomers);
// router.put("/api/customers/:id", updateCustomerStatus);

//website user login register
router.post("/api/register", registerWebUser);
router.post("/api/web-login", loginWebUser);
// ADMIN PANEL → WEBSITE register USERS LIST
router.get("/api/web-users", getAllWebUsers);
router.post("/api/web-forgot-password", forgotPassword);
router.post("/api/web-verify-otp", verifyOtp);
router.post("/api/web-reset-password", resetPassword);


// WEBSITE USER → CREATE PROFILE
router.post(
  "/api/profile",
  isWebUser,
  upload.fields([
    { name: "pan", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "electricity_bill", maxCount: 1 },
  ]),
  profileController.createProfile
);
router.put(
  "/api/profile",
  isWebUser,
  upload.fields([
    { name: "pan", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "electricity_bill", maxCount: 1 },
  ]),
  profileController.updateProfile
);
// WEBSITE USER → VIEW OWN PROFILE
router.get(
  "/api/profile/me",
  isWebUser,
  profileController.myProfile
);

// ADMIN → VIEW ALL PROFILES
router.get(
  "/api/admin/profiles",
  profileController.getAllProfiles
);

router.put(
  "/api/admin/profile/:id/status",
  profileController.updateStatus
);


router.put(
  "/api/admin/profile/:id/document",
  upload.single("document"),
  profileController.uploadAdminDocument
);



module.exports = router;
