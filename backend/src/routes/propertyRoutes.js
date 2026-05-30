const express = require("express");
const multer = require("multer");
const propertyController = require("../controllers/propertyController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", propertyController.getAllProperties);
router.get("/random", propertyController.getRandomProperties);
router.get("/locations", propertyController.getLocations);
router.get("/types", propertyController.getPropertyTypes);
router.get("/search", propertyController.searchProperties);
router.post("/by-ids", propertyController.getPropertiesByIds);
router.get("/:id", propertyController.getPropertyById);
router.post("/", upload.array('images', 5), propertyController.createProperty);

module.exports = router;
