import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropertyGrid from "./property_grid";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Buy() {
  // ... (All state and functions from the previous working version remain the same)
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCity = searchParams.get("city") || "";
  const initialType = searchParams.get("type") || "";

  const [cityFilter, setCityFilter] = useState(initialCity);
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [appliedFilters, setAppliedFilters] = useState({
    city: initialCity,
    type: initialType,
    min: 0,
    max: 50000000,
  });
  const [properties, setProperties] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [dropdownData, setDropdownData] = useState({
    cities: [],
    propertyTypes: [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    /* ... fetchDropdownData logic ... */
    const fetchDropdownData = async () => {
      try {
        const { data: locationsData } = await api.get("/properties/locations");
        if (locationsData) {
          const uniqueCities = [
            ...new Set(
              locationsData
                .map((p) => p.city)
                .filter(Boolean)
            ),
          ];
          setDropdownData((prev) => ({ ...prev, cities: uniqueCities }));
        }
        const { data: typesData } = await api.get("/properties/types");
        if (typesData) {
          const types = typesData.map((t) => t.type_name);
          setDropdownData((prev) => ({ ...prev, propertyTypes: types }));
        }
      } catch (err) {
        console.error("Error fetching dropdown data", err);
      }
    };
    fetchDropdownData();
  }, []);
  useEffect(() => {
    /* ... fetchProperties logic ... */
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/properties/search", {
          params: {
            location: appliedFilters.city,
            type: appliedFilters.type,
            min: appliedFilters.min,
            max: appliedFilters.max >= 50000000 ? undefined : appliedFilters.max,
          }
        });
        setProperties(data || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [appliedFilters]);
  useEffect(() => {
    /* ... fetchWishlist logic ... */
    if (!user) {
      setWishlist(new Set());
      return;
    }
    const fetchWishlist = async () => {
      try {
        const { data } = await api.get(`/wishlists/${user.id}`);
        if (data) {
          setWishlist(new Set(data.map((item) => item.property_id)));
        }
      } catch (err) {
        console.error("Error fetching wishlist", err);
      }
    };
    fetchWishlist();
  }, [user]);

  const handleApplyFilters = () => {
    /* ... logic ... */
    setAppliedFilters({
      city: cityFilter,
      type: typeFilter,
      min: minPrice,
      max: maxPrice,
    });
    setMobileFiltersOpen(false);
  };
  const handleResetFilters = () => {
    /* ... logic ... */
    setCityFilter("");
    setTypeFilter("");
    setMinPrice(0);
    setMaxPrice(50000000);
    setAppliedFilters({ city: "", type: "", min: 0, max: 50000000 });
  };

  const handleToggleWishlist = async (propertyId) => {
    // 1. Check if a user is logged in
    if (!user) {
      alert("Please log in to add properties to your wishlist.");
      return;
    }

    const isWishlisted = new Set(wishlist).has(propertyId);

    try {
      if (isWishlisted) {
        // 2. If it is wishlisted, REMOVE it from the database
        await api.delete("/wishlists", {
          data: { user_id: user.id, property_id: propertyId }
        });

        // 3. Update the local state for immediate UI feedback
        setWishlist((prev) => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
      } else {
        // 4. If it's not wishlisted, ADD it to the database
        await api.post("/wishlists", {
          user_id: user.id,
          property_id: propertyId
        });

        // 5. Update the local state for immediate UI feedback
        setWishlist((prev) => new Set(prev).add(propertyId));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error.message);
    }
  };

  const renderFilters = () => (
    <div className="space-y-6">
      {/* Styled City Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Cities</option>
          {dropdownData.cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Styled Property Type Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Property Type
        </label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          {dropdownData.propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Styled Price Sliders */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range (₹)
        </label>
        <div className="flex justify-between mb-4 text-sm font-semibold text-blue-700">
          <span>₹{minPrice.toLocaleString("en-IN")}</span>
          <span>{maxPrice >= 50000000 ? "₹5,00,00,000+" : `₹${maxPrice.toLocaleString("en-IN")}`}</span>
        </div>
        
        <div className="relative w-full h-2 bg-gray-200 rounded-lg mb-8 mt-4">
          <div 
            className="absolute h-full bg-blue-600 rounded-lg pointer-events-none" 
            style={{ left: `${(minPrice / 50000000) * 100}%`, right: `${100 - (maxPrice / 50000000) * 100}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max="50000000"
            step="500000"
            value={minPrice}
            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 500000))}
            style={{ zIndex: minPrice > 25000000 ? 20 : 10 }}
            className="absolute w-full -top-2 h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
          />
          <input
            type="range"
            min="0"
            max="50000000"
            step="500000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 500000))}
            style={{ zIndex: minPrice > 25000000 ? 10 : 20 }}
            className="absolute w-full -top-2 h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
          />
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <button
          onClick={handleApplyFilters}
          className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition shadow-sm"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="w-full py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );

  // The main return block for Buy.jsx remains the same
  return (
    <div className="px-4 lg:px-8 pt-20 py-8 w-full flex flex-col lg:flex-row gap-8">
      <aside className="hidden mt-10 lg:block w-full max-w-xs bg-white p-6 rounded-lg shadow-md sticky top-24 h-fit">
        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
          Filters
        </h3>
        {renderFilters()}
      </aside>
      <div className="lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow"
        >
          Filter Properties
        </button>
      </div>
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start pt-20 px-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 overflow-y-auto max-h-[80vh] relative">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute top-4 right-4 text-gray-600 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Filters</h3>
            {renderFilters()}
          </div>
        </div>
      )}
      <section className="flex-1 w-full">
        {loading ? (
          <p className="text-center py-8">Loading properties...</p>
        ) : (
          <PropertyGrid
            properties={properties.filter((property) => property.owner_id !== user?.id)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </section>
    </div>
  );
}
