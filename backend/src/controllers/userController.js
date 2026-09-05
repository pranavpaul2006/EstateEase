const userService = require("../services/userService");
const storageService = require("../services/storageService");

class UserController {
  async getProfileByEmail(req, res, next) {
    try {
      const profile = await userService.getProfileByEmail(req.supabase, req.params.email);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async getProfileById(req, res, next) {
    try {
      const profile = await userService.getProfileById(req.supabase, req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async createProfile(req, res, next) {
    try {
      const profile = await userService.createProfile(req.supabase, req.body);
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const updates = { ...req.body };
      
      if (req.file) {
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${req.params.id}-${Date.now()}.${fileExt}`;
        updates.avatar_url = await storageService.uploadFile(req.supabase, 'avatars', fileName, req.file.buffer, req.file.mimetype);
      }

      const profile = await userService.updateProfile(req.supabase, req.params.id, updates);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req, res, next) {
    try {
      await userService.deleteProfile(req.supabase, req.params.id);
      res.json({ message: "Profile deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getUserProperties(req, res, next) {
    try {
      const properties = await userService.getUserProperties(req.supabase, req.params.id);
      const mapped = properties.map(p => ({
        ...p,
        image_url: p.property_images?.find(img => img.is_primary)?.image_url || p.property_images?.[0]?.image_url
      }));
      res.json(mapped);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
