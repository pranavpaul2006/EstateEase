import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiDollarSign, FiUser, FiChevronLeft, FiChevronRight, FiCheckCircle, FiUploadCloud, FiX, FiLoader } from "react-icons/fi";
import api from "../services/api";

const AMENITIES_LIST = [
  "Swimming Pool", "Gym", "Parking", "Garden", "24/7 Security", "Balcony", "Fully Furnished", "Pet Friendly"
];

const Sell = ({ onAddProperty }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    images: [],
    amenities: [],
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
  });
  
  const [dropdownData, setDropdownData] = useState({ propertyTypes: [] });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // **MODIFIED**: Fetches property types from your Supabase table
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const { data } = await api.get('/properties/types');

        if (!data) throw new Error("Failed to fetch property types");

        const formattedTypes = data.map(type => ({
          label: type.type_name,
          value: type.type_name
        }));
        
        setDropdownData({ propertyTypes: formattedTypes });

      } catch (error) {
        console.error("Error fetching property types:", error.message);
      }
    };

    fetchPropertyTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages].slice(0, 5) }));
  };
  
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateIntermediateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.propertyType) newErrors.propertyType = "Please select a property type.";
      if (!formData.location.trim()) newErrors.location = "Location is required.";
    }
    if (step === 2) {
      if (!formData.price || formData.price <= 0) newErrors.price = "Please enter a valid price.";
      if (!formData.area || formData.area <= 0) newErrors.area = "Please enter a valid area.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateIntermediateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  // **MODIFIED**: Submits all data to your Supabase tables
  // In Sell.js

const handleSubmit = async (e) => {
    e.preventDefault();
    // --- All your validation logic stays the same ---
    const finalErrors = {};
    if (!formData.ownerName.trim()) finalErrors.ownerName = "Your name is required.";
    if (!formData.ownerEmail || !/\S+@\S+\.\S+/.test(formData.ownerEmail)) finalErrors.ownerEmail = "A valid email is required.";
    if (!formData.ownerPhone.trim()) finalErrors.ownerPhone = "A phone number is required.";
    setErrors(finalErrors);
    if (Object.keys(finalErrors).length > 0) return;

    setIsSubmitting(true);

    try {
        const submitData = new FormData();
        submitData.append('title', `${formData.propertyType} in ${formData.location}`);
        submitData.append('description', formData.description);
        submitData.append('propertyType', formData.propertyType);
        submitData.append('price', formData.price);
        submitData.append('area', formData.area);
        submitData.append('location', formData.location);
        
        const locationParts = formData.location.split(',');
        submitData.append('city', locationParts[0]?.trim() || '');
        submitData.append('state', locationParts[1]?.trim() || '');
        
        submitData.append('ownerName', formData.ownerName);
        submitData.append('ownerEmail', formData.ownerEmail);
        submitData.append('ownerPhone', formData.ownerPhone);

        if (formData.images && formData.images.length > 0) {
            formData.images.forEach((img) => {
                submitData.append('images', img.file);
            });
        }

        const res = await api.post('/properties', submitData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // If everything succeeded
        setIsSubmitted(true);
        if (onAddProperty) {
            onAddProperty(formData);
        }

    } catch (error) {
        console.error('Error submitting property:', error);
        alert(`Submission Failed: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
};

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-10 rounded-2xl shadow-lg max-w-lg w-full">
            <FiCheckCircle className="mx-auto text-green-500 text-7xl mb-5" />
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Submission Successful!</h1>
            <p className="text-gray-600 mb-8">
              Your property has been successfully listed on EstateEase.
            </p>
            <Link to="/">
                <button className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition cursor-pointer">
                    Go to Home
                </button>
            </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = ((step - 1) / 2) * 100;

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden md:grid md:grid-cols-2">
        {/* Left Side: Information */}
        <div className="bg-[#2b6777] p-8 md:p-12 text-white flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">List Your Property with EstateEase</h1>
            <p className="text-gray-200 leading-relaxed mb-8">
                Provide detailed information and photos to attract the best buyers. Our platform makes selling simple, transparent, and secure.
            </p>
            <div className="mt-4 p-6 bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold mb-3">Your submission includes:</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li className={`flex items-center gap-3 transition-colors ${step >= 1 ? 'text-white' : ''}`}><FiHome className={`transition-transform ${step >= 1 ? 'scale-110 text-blue-400' : ''}`} /> Basic Information & Photos</li>
                    <li className={`flex items-center gap-3 transition-colors ${step >= 2 ? 'text-white' : ''}`}><FiDollarSign className={`transition-transform ${step >= 2 ? 'scale-110 text-blue-400' : ''}`} /> Details, Price & Amenities</li>
                    <li className={`flex items-center gap-3 transition-colors ${step >= 3 ? 'text-white' : ''}`}><FiUser className={`transition-transform ${step >= 3 ? 'scale-110 text-blue-400' : ''}`} /> Contact Information</li>
                </ul>
            </div>
        </div>

        {/* Right Side: Multi-Step Form */}
        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Progress Bar */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-blue-600">Step {step} of 3</p>
                    <p className="text-sm text-gray-500">{step === 1 ? 'Property Info' : step === 2 ? 'Details & Price' : 'Contact'}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            <div className="flex-grow mt-8">
              {step === 1 && (
              <section className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800"><FiHome /> Basic Information</h2>
                  <div>
                      <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                      <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="" disabled>Select a property type</option>
                          {dropdownData.propertyTypes.map(type => (
                              <option key={type.value} value={type.label}>{type.label}</option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location / City</label>
                      <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property Images (Optional, Max 5)</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors hover:border-blue-500 border-gray-300">
                          <div className="space-y-1 text-center">
                              <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400"/>
                              <div className="flex text-sm text-gray-600">
                                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                      <span>Upload files</span>
                                      <input id="file-upload" name="file-upload" type="file" multiple onChange={handleFileChange} className="sr-only" accept="image/*" />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                          </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                          {formData.images.map((image, index) => (
                              <div key={index} className="relative group aspect-square">
                                  <img src={image.preview} alt={`preview ${index}`} className="h-full w-full object-cover rounded-md"/>
                                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <FiX size={14}/>
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </section>
              )}

              {step === 2 && (
              <section className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800"><FiDollarSign /> Details, Price & Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Expected Price (₹)</label>
                          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`} />
                          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                      </div>
                      <div>
                          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Area (sq. ft.)</label>
                          <input type="number" id="area" name="area" value={formData.area} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.area ? 'border-red-500' : 'border-gray-300'}`} />
                          {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                      </div>
                  </div>
                  <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                      <div className="flex flex-wrap gap-2">
                          {AMENITIES_LIST.map(amenity => (
                              <button type="button" key={amenity} onClick={() => handleAmenityToggle(amenity)} className={`px-3 py-1 text-sm rounded-full transition-colors cursor-pointer ${formData.amenities.includes(amenity) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                  {amenity}
                              </button>
                          ))}
                      </div>
                  </div>
              </section>
              )}

              {step === 3 && (
              <section className="space-y-4 animate-fade-in">
                  <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800"><FiUser /> Your Contact Information</h2>
                  <div>
                      <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input type="text" id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.ownerName ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
                  </div>
                  <div>
                      <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input type="email" id="ownerEmail" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.ownerEmail ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.ownerEmail && <p className="text-red-500 text-xs mt-1">{errors.ownerEmail}</p>}
                  </div>
                  <div>
                      <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" id="ownerPhone" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.ownerPhone ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.ownerPhone && <p className="text-red-500 text-xs mt-1">{errors.ownerPhone}</p>}
                  </div>
              </section>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 mt-auto">
              <button type="button" onClick={prevStep} disabled={step === 1} className="px-6 py-2 bg-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                <FiChevronLeft /> Previous
              </button>
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="px-6 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 cursor-pointer">
                  Next <FiChevronRight />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 cursor-pointer disabled:bg-green-300 w-36">
                  {isSubmitting ? <FiLoader className="animate-spin" /> : 'Submit Listing'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sell;