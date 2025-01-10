const express = require("express");
const protectRoute = require("../middleware/authMiddleware.js");
const router = express.Router();
const {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} = require("../controllers/authController.js");

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

module.exports = router;
