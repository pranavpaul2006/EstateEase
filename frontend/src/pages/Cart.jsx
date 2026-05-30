import React, { useState, useEffect } from "react";
import PropertyGrid from "../components/property_grid";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";

// This component is now self-sufficient and fetches its own data.
export default function Cart() {
  const { user } = useAuth();

  // State for the full property objects and just their IDs
  const [wishlistedProperties, setWishlistedProperties] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistDetails = async () => {
      if (!user) {
        setLoading(false);
        setWishlistedProperties([]); // Clear list if user logs out
        return;
      }

      setLoading(true);

      try {
        // 1. Get the list of property IDs from the user's wishlist
        const { data: idsData } = await api.get(`/wishlists/${user.id}`);

        if (!idsData || idsData.length === 0) {
          setWishlistedProperties([]);
          setWishlistIds(new Set());
          setLoading(false);
          return;
        }

        const propertyIds = idsData.map((item) => item.property_id);
        setWishlistIds(new Set(propertyIds));

        // 2. Fetch the full details for those properties using our backend
        const { data: propertiesData } = await api.post("/properties/by-ids", {
          ids: propertyIds,
        });

        setWishlistedProperties(propertiesData || []);
      } catch (error) {
        console.error("Error fetching wishlist properties:", error);
      }

      setLoading(false);
    };

    fetchWishlistDetails();
  }, [user]); // Refetch whenever the user changes

  // This function now removes the item from the view instantly
  const handleToggleWishlist = async (propertyId) => {
    if (!user) return;

    try {
      // The item is guaranteed to be in the wishlist on this page
      await api.delete("/wishlists", {
        data: { user_id: user.id, property_id: propertyId }
      });

      // For a great user experience, remove the item from the UI immediately
      setWishlistIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
      setWishlistedProperties((prev) =>
        prev.filter((p) => p.property_id !== propertyId)
      );
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  if (loading) {
    return <div className="text-center pt-32">Loading your wishlist...</div>;
  }

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>

        {wishlistedProperties.length > 0 ? (
          <PropertyGrid
            properties={wishlistedProperties}
            wishlist={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : (
          <div className="text-center text-gray-600 mt-20 p-8 border-2 border-dashed rounded-lg">
            <p className="mb-4">
              You haven't added any properties to your wishlist yet.
            </p>
            <Link
              to="/buy"
              className="text-blue-600 hover:underline font-semibold"
            >
              Explore Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
