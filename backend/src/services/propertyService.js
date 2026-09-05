class PropertyService {
  async getAllProperties(supabase) {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        property_types ( type_name ),
        property_images ( image_url, is_primary )
      `);
    if (error) throw new Error(error.message);
    return data;
  }

  async getPropertyById(supabase, id) {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        property_types ( type_name ),
        profiles!owner_id ( full_name, email, phone_number ),
        property_images ( image_url, is_primary )
      `)
      .eq("property_id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async getPropertiesByIds(supabase, idsArray) {
    if (!idsArray || idsArray.length === 0) return [];
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        property_types ( type_name ),
        property_images ( image_url, is_primary )
      `)
      .in("property_id", idsArray);
    if (error) throw new Error(error.message);
    return data;
  }

  async getRandomProperties(supabase, count = 3) {
    const { data, error } = await supabase.rpc("get_random_properties", { count });
    if (error) {
      // Fallback if RPC doesn't exist
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("properties")
        .select(`*, property_types ( type_name ), property_images ( image_url, is_primary )`)
        .limit(count);
      if (fallbackError) throw new Error(fallbackError.message);
      return fallbackData;
    }
    return data;
  }

  async getLocations(supabase) {
    const { data, error } = await supabase.from("properties").select("location");
    if (error) throw new Error(error.message);
    
    // Extract unique cities (assuming location format "City, State" or just "City")
    const cities = new Set();
    data.forEach(item => {
      if (item.location) {
        const city = item.location.split(',')[0].trim();
        cities.add(city);
      }
    });
    return Array.from(cities).map(city => ({ city }));
  }

  async getPropertyTypes(supabase) {
    const { data, error } = await supabase.from("property_types").select("type_name");
    if (error) throw new Error(error.message);
    return data;
  }

  async searchProperties(supabase, searchQuery, location, propertyType, minPrice, maxPrice) {
    let query = supabase.from("properties").select(`
      *,
      property_types!inner(type_name),
      property_images ( image_url, is_primary )
    `);

    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }
    if (location) {
      query = query.ilike("location", `%${location}%`);
    }
    if (propertyType) {
      query = query.eq("property_types.type_name", propertyType);
    }
    if (minPrice !== undefined && minPrice !== null) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== null) {
      query = query.lte("price", maxPrice);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  async createProperty(supabase, propertyData) {
    const { data, error } = await supabase
      .from("properties")
      .insert([propertyData])
      .select();
    if (error) throw new Error(error.message);
    return data[0];
  }

  async getPropertyTypeId(supabase, typeName) {
    const { data, error } = await supabase
      .from("property_types")
      .select("id")
      .eq("type_name", typeName)
      .single();
    if (error) throw new Error(`Property type ${typeName} not found.`);
    return data.id;
  }
}

module.exports = new PropertyService();
