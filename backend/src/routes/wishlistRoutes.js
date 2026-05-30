const express = require("express");
const wishlistController = require("../controllers/wishlistController");

const router = express.Router();

router.get("/:userId", wishlistController.getWishlist);
router.post("/", wishlistController.addToWishlist);
router.delete("/", wishlistController.removeFromWishlist); // using delete with body or better a specific endpoint, let's use post for removal or delete with body

module.exports = router;
