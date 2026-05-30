const express = require("express");
const router = express.Router();

const propertyRoutes = require("./propertyRoutes");
const userRoutes = require("./userRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const wishlistRoutes = require("./wishlistRoutes");

router.use("/properties", propertyRoutes);
router.use("/users", userRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/wishlists", wishlistRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
