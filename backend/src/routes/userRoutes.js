const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/email/:email", userController.getProfileByEmail);
router.get("/:id", userController.getProfileById);
router.post("/", userController.createProfile);
router.put("/:id", upload.single('avatar'), userController.updateProfile);
router.delete("/:id", userController.deleteProfile);
router.get("/:id/properties", userController.getUserProperties);

module.exports = router;
