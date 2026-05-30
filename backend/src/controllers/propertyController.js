const propertyService = require("../services/propertyService");
const storageService = require("../services/storageService");

class PropertyController {
  async getAllProperties(req, res, next) {
    try {
      const properties = await propertyService.getAllProperties();
      const mapped = properties.map(p => ({
        ...p,
        type_name: p.property_types?.type_name,
        image_url: p.property_images?.find(img => img.is_primary)?.image_url || p.property_images?.[0]?.image_url
      }));
      res.json(mapped);
    } catch (error) {
      next(error);
    }
  }

  async getRandomProperties(req, res, next) {
    try {
      const count = parseInt(req.query.count) || 3;
      const properties = await propertyService.getRandomProperties(count);
      const mapped = properties.map(p => ({
        ...p,
        type_name: p.property_types?.type_name,
        image_url: p.property_images?.find(img => img.is_primary)?.image_url || p.property_images?.[0]?.image_url
      }));
      res.json(mapped);
    } catch (error) {
      next(error);
    }
  }

  async getLocations(req, res, next) {
    try {
      const locations = await propertyService.getLocations();
      res.json(locations);
    } catch (error) {
      next(error);
    }
  }

  async getPropertyTypes(req, res, next) {
    try {
      const types = await propertyService.getPropertyTypes();
      res.json(types);
    } catch (error) {
      next(error);
    }
  }

  async searchProperties(req, res, next) {
    try {
      const { q, location, type, min, max } = req.query;
      const properties = await propertyService.searchProperties(q, location, type, min, max);
      const mapped = properties.map(p => ({
        ...p,
        type_name: p.property_types?.type_name,
        image_url: p.property_images?.find(img => img.is_primary)?.image_url || p.property_images?.[0]?.image_url
      }));
      res.json(mapped);
    } catch (error) {
      next(error);
    }
  }

  async getPropertiesByIds(req, res, next) {
    try {
      const { ids } = req.body;
      const properties = await propertyService.getPropertiesByIds(ids);
      const mapped = properties.map(p => ({
        ...p,
        type_name: p.property_types?.type_name,
        image_url: p.property_images?.find(img => img.is_primary)?.image_url || p.property_images?.[0]?.image_url
      }));
      res.json(mapped);
    } catch (error) {
      next(error);
    }
  }

  async getPropertyById(req, res, next) {
    try {
      const property = await propertyService.getPropertyById(req.params.id);
      res.json(property);
    } catch (error) {
      next(error);
    }
  }

  async createProperty(req, res, next) {
    try {
      const { title, description, price, city, state, propertyType, ownerEmail, area } = req.body;
      
      const typeId = await propertyService.getPropertyTypeId(propertyType);
      
      const userService = require("../services/userService");
      let profile = await userService.getProfileByEmail(ownerEmail);
      if (!profile) {
          profile = await userService.createProfile({
              full_name: req.body.ownerName || 'Unknown',
              email: ownerEmail,
              phone_number: req.body.ownerPhone || '0000000000'
          });
      }

      const propertyData = {
        title,
        property_description: description,
        price: parseFloat(price),
        location: `${city}, ${state}`,
        property_type_id: typeId,
        owner_id: profile.id,
        area_sqft: parseInt(area) || 0,
        is_available: true
      };

      const newProperty = await propertyService.createProperty(propertyData);

      // Handle Images
      if (req.files && req.files.length > 0) {
        const imageUrls = await Promise.all(
          req.files.map(async (file) => {
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${newProperty.property_id || newProperty.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `public/${fileName}`;
            return await storageService.uploadFile('property-images', filePath, file.buffer, file.mimetype);
          })
        );
        
        // Insert into property_images
        const { supabase } = require("../config/supabaseClient");
        const imageRows = imageUrls.map((url, index) => ({
            property_id: newProperty.property_id || newProperty.id,
            image_url: url,
            is_primary: index === 0
        }));
        await supabase.from("property_images").insert(imageRows);
      }

      res.status(201).json(newProperty);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PropertyController();
