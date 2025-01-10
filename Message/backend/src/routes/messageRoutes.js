const express = require("express");
const protectRoute = require("../middleware/authMiddleware.js");
const router = express.Router();
const {
  getUsersForSidebar,
  getMessages,
  sendMessages,
} = require("../controllers/messageController.js");

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessages);

module.exports = router;
