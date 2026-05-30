const { supabase } = require("../config/supabaseClient");

class StorageService {
  async uploadFile(bucket, path, fileBuffer, mimeType) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType: mimeType,
        upsert: false
      });
    
    if (error) throw new Error(error.message);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    return urlData.publicUrl;
  }
}

module.exports = new StorageService();
