const { supabase } = require("../config/supabaseClient");

class UserService {
  async getProfileByEmail(email) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();
    
    // We don't throw an error if not found, since it's used for checking existence
    if (error && error.code !== "PGRST116") { // PGRST116 is "No rows found"
       throw new Error(error.message);
    }
    return data;
  }

  async getProfileById(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async createProfile(profileData) {
    const { data, error } = await supabase
      .from("profiles")
      .insert([profileData])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteProfile(userId) {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return true;
  }

  async getUserProperties(userId) {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        property_images ( image_url, is_primary )
      `)
      .eq("owner_id", userId);
    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = new UserService();
