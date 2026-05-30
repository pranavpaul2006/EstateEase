const { supabase } = require("../config/supabaseClient");

class WishlistService {
  async getWishlist(userId) {
    const { data, error } = await supabase
      .from("wishlists")
      .select("property_id")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return data;
  }

  async addToWishlist(userId, propertyId) {
    const { data, error } = await supabase
      .from("wishlists")
      .insert({ user_id: userId, property_id: propertyId });
    if (error) throw new Error(error.message);
    return data;
  }

  async removeFromWishlist(userId, propertyId) {
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .match({ user_id: userId, property_id: propertyId });
    if (error) throw new Error(error.message);
    return true;
  }
}

module.exports = new WishlistService();
