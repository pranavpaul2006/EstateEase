const wishlistService = require("../services/wishlistService");

class WishlistController {
  async getWishlist(req, res, next) {
    try {
      const wishlist = await wishlistService.getWishlist(req.params.userId);
      res.json(wishlist);
    } catch (error) {
      next(error);
    }
  }

  async addToWishlist(req, res, next) {
    try {
      await wishlistService.addToWishlist(req.body.user_id, req.body.property_id);
      res.json({ message: "Added to wishlist" });
    } catch (error) {
      next(error);
    }
  }

  async removeFromWishlist(req, res, next) {
    try {
      await wishlistService.removeFromWishlist(req.body.user_id, req.body.property_id);
      res.json({ message: "Removed from wishlist" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WishlistController();
