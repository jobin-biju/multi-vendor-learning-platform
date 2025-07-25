const express = require("express");
const router = express.Router();

// Corrected to point to the right controller file
const ChatController = require("../controller/chat.controller");

router.get("/getlearner", ChatController.fetchLearners);
router.get("/getVendors", ChatController.fetchVendors);
router.post("/send", ChatController.send);
router.post("/getChat", ChatController.getChat);

module.exports = router;
