import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropertyGrid from "./property_grid";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- State ---
  const [properties, setProperties] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [dropdownData, setDropdownData] = useState({
    cities: [],
    propertyTypes: [],
  });
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [typeSuggestions, setTypeSuggestions] = useState([]);
  const [isCitySuggestionsOpen, setIsCitySuggestionsOpen] = useState(false);
  const [isTypeSuggestionsOpen, setIsTypeSuggestionsOpen] = useState(false);
  const citySearchRef = useRef(null);
  const typeSearchRef = useRef(null);

  // --- Fetch data ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: allProps } = await api.get('/properties');
        // Shuffle and slice to simulate get_random_properties
        const shuffled = [...allProps].sort(() => 0.5 - Math.random());
        setProperties(shuffled.slice(0, 6));
        
        const uniqueCities = [
          ...new Set(
            allProps
              .map((p) => p.location?.split(",")[0]?.trim())
              .filter(Boolean)
          ),
        ];
        setDropdownData((prev) => ({
          ...prev,
          cities: uniqueCities.map((c) => ({ label: c, value: c })),
        }));

        const { data: typesData } = await api.get('/properties/types');
        if (typesData) {
          const types = typesData.map((t) => t.type_name);
          setDropdownData((prev) => ({
            ...prev,
            propertyTypes: types.map((t) => ({ label: t, value: t })),
          }));
        }
      } catch (err) {
        console.error("Error fetching hero data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Fetch wishlist ---
  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, [user]);

  // --- Close dropdowns on outside click ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        citySearchRef.current &&
        !citySearchRef.current.contains(event.target)
      )
        setIsCitySuggestionsOpen(false);
      if (
        typeSearchRef.current &&
        !typeSearchRef.current.contains(event.target)
      )
        setIsTypeSuggestionsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Wishlist toggle ---
  const handleToggleWishlist = async (propertyId) => {
    if (!user) {
      alert("Please log in to add properties to your wishlist.");
      return;
    }
    const isWishlisted = new Set(wishlist).has(propertyId);
    try {
      if (isWishlisted) {
        await api.delete('/wishlists', { data: { user_id: user.id, property_id: propertyId } });
        setWishlist((prev) => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
      } else {
        await api.post('/wishlists', { user_id: user.id, property_id: propertyId });
        setWishlist((prev) => new Set(prev).add(propertyId));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error.message);
    }
  };

  // --- Dropdown handlers ---
  const handleCityChange = (e) => {
    const value = e.target.value;
    setSelectedCity(value);
    setCitySuggestions(
      value
        ? dropdownData.cities.filter((city) =>
            city.label.toLowerCase().includes(value.toLowerCase())
          )
        : dropdownData.cities
    );
    setIsCitySuggestionsOpen(true);
  };
  const handleCitySuggestionClick = (city) => {
    setSelectedCity(city.label);
    setIsCitySuggestionsOpen(false);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    setTypeSuggestions(
      value
        ? dropdownData.propertyTypes.filter((type) =>
            type.label.toLowerCase().includes(value.toLowerCase())
          )
        : dropdownData.propertyTypes
    );
    setIsTypeSuggestionsOpen(true);
  };
  const handleTypeSuggestionClick = (type) => {
    setSelectedType(type.label);
    setIsTypeSuggestionsOpen(false);
  };

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (selectedCity) query.append("city", selectedCity);
    if (selectedType) query.append("type", selectedType);
    navigate(`/buy?${query.toString()}`);
  };

  return (
    <div className="w-full">
      {/* HERO SECTION (old design restored) */}
      <div className="relative w-full h-[25rem] flex items-center justify-center bg-[#f2f2f2] bg-[url('/images/hero_bg.png')] bg-cover bg-[30%_80%] z-30">
        <div className="absolute inset-0 bg-black/35"></div>
        <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-6xl text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-6">
            Find Your Dream Property
          </h1>
          <p className="text-white mb-6 max-w-xl">
            Search from thousands of properties across your favorite cities
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-4xl">
            {/* City ComboBox (old design restored) */}
            <div ref={citySearchRef} className="relative w-60 md:w-80">
              <div className="flex items-center justify-between bg-white rounded-lg shadow-md px-4 py-2 w-full">
                <input
                  type="text"
                  value={selectedCity}
                  onChange={handleCityChange}
                  onFocus={() => {
                    setCitySuggestions(dropdownData.cities);
                    setIsCitySuggestionsOpen(true);
                  }}
                  placeholder="Enter location or city"
                  className="w-full bg-transparent focus:outline-none placeholder-gray-400"
                />
                <div
                  onClick={() =>
                    setIsCitySuggestionsOpen(!isCitySuggestionsOpen)
                  }
                  className="cursor-pointer"
                >
                  <span className="text-gray-500">▼</span>
                </div>
              </div>
              {isCitySuggestionsOpen && (
                <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg text-left scrollbar-none">
                  {citySuggestions.length > 0 ? (
                    citySuggestions.map((city) => (
                      <li
                        key={city.value}
                        onClick={() => handleCitySuggestionClick(city)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {city.label}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-400 cursor-default">
                      Not available
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Property Type ComboBox (old design restored) */}
            <div ref={typeSearchRef} className="relative w-40 md:w-60">
              <div className="flex items-center justify-between bg-white rounded-lg shadow-md px-4 py-2 w-full">
                <input
                  type="text"
                  value={selectedType}
                  onChange={handleTypeChange}
                  onFocus={() => {
                    setTypeSuggestions(dropdownData.propertyTypes);
                    setIsTypeSuggestionsOpen(true);
                  }}
                  placeholder="Property type"
                  className="w-full bg-transparent focus:outline-none placeholder-gray-400"
                />
                <div
                  onClick={() =>
                    setIsTypeSuggestionsOpen(!isTypeSuggestionsOpen)
                  }
                  className="cursor-pointer"
                >
                  <span className="text-gray-500">▼</span>
                </div>
              </div>
              {isTypeSuggestionsOpen && (
                <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg text-left scrollbar-none">
                  {typeSuggestions.length > 0 ? (
                    typeSuggestions.map((type) => (
                      <li
                        key={type.value}
                        onClick={() => handleTypeSuggestionClick(type)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {type.label}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-400 cursor-default">
                      Not available
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Search Button (old style restored) */}
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* PROPERTIES SECTION (unchanged logic) */}
      <div className="px-4">
        <PropertyGrid
          properties={properties}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />
      </div>
    </div>
  );
}
