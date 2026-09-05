const wishlistService = require("../services/wishlistService");

class WishlistController {
  async getWishlist(req, res, next) {
    try {
      const wishlist = await wishlistService.getWishlist(req.supabase, req.params.userId);
      res.json(wishlist);
    } catch (error) {
      next(error);
    }
  }

  async addToWishlist(req, res, next) {
    try {
      await wishlistService.addToWishlist(req.supabase, req.body.user_id, req.body.property_id);
      res.json({ message: "Added to wishlist" });
    } catch (error) {
      next(error);
    }
  }

  async removeFromWishlist(req, res, next) {
    try {
      await wishlistService.removeFromWishlist(req.supabase, req.body.user_id, req.body.property_id);
      res.json({ message: "Removed from wishlist" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WishlistController();
