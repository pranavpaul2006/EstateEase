import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";
import Notification from "../components/Notification";

const DEFAULT_IMAGE_URL =
  "https://via.placeholder.com/800x600.png?text=Image+Not+Available";

const Property = () => {
  const { id } = useParams(); // Get property ID from the URL
  const { user } = useAuth(); // Get current user from AuthContext

  // State for this component
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for appointment booking
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showModal, setShowModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("idle"); // idle, booked, error
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Fetch property details from Supabase when the component mounts or ID changes
  // In Property.jsx

  // In Property.jsx

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        // ✅ FIX: Call backend API to fetch property details
        const response = await api.get(`/properties/${id}`);
        const data = response.data;

        if (!data) {
          throw new Error(
            "Could not find property details. It may not exist or you may not have permission to view it."
          );
        }

        setProperty(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  // Handle the booking confirmation
  const handleConfirmBooking = async () => {
    if (!user || !property) return;

    // Combine selected date with a default time (e.g., 10:00 AM) to create a valid timestamp
    const meetingTime = `${selectedDate}T10:00:00`;

    try {
      await api.post("/appointments", {
        property_id: property.property_id || property.id, // handle both cases
        user_id: user.id,
        owner_id: property.owner_id,
        meeting_time: meetingTime,
        status: "pending",
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      setBookingStatus("error");
      setNotification({
        show: true,
        message: "Failed to book appointment. Please try again.",
        type: "error",
      });
    } finally {
      // If success
      if (bookingStatus !== 'error') {
        setBookingStatus("booked");
        setNotification({
          show: true,
          message: "Appointment requested successfully!",
          type: "success",
        });
      }
    }
  };

  const handleBookClick = () => {
    setError("");
    if (!user) {
      setError("Please log in to book an appointment.");
      return;
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setBookingStatus("idle");
  };

  // Helper to find the best image to display
  const getPrimaryImage = () => {
    if (
      !property ||
      !property.property_images ||
      property.property_images.length === 0
    ) {
      return DEFAULT_IMAGE_URL;
    }
    const primary = property.property_images.find((img) => img.is_primary);
    return primary?.image_url || property.property_images[0].image_url;
  };

  if (loading)
    return <div className="text-center pt-32">Loading property details...</div>;
  if (error || !property)
    return (
      <div className="text-center pt-32 text-red-500">
        {error || "Property not found."}
      </div>
    );

  const propertyStatus = property.is_available ? "Available" : "Sold";

  return (
    <>
      <div className="bg-gray-50 min-h-screen pt-20 pb-10">
        <div className="w-full mx-auto flex flex-col px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-32">
          {/* TOP SECTION: Image + Core Details */}
          <div className="grid grid-cols-1 pt-12 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            <div className="flex items-center justify-center">
              <img
                src={getPrimaryImage()}
                alt={property.title}
                className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg"
              />
            </div>

            <div className="flex flex-col justify-center space-y-6 lg:space-y-8 ">
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full w-max ${
                  property.is_available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {propertyStatus}
              </span>
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900">
                {property.title}
              </h1>

              <div className="flex items-center text-gray-600 text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{property.location}</span>
              </div>

              <div className="flex flex-wrap gap-x-10 gap-y-6 pt-4 text-gray-800">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Price</span>
                  <span className="text-4xl font-bold text-blue-600">{`₹ ${Number(
                    property.price
                  ).toLocaleString("en-IN")}`}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Area (sq. ft.)</span>
                  <span className="text-4xl font-semibold">
                    {Number(property.area_sqft).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Listed by:{" "}
                <strong>{property.profiles?.full_name || "Unknown"}</strong>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: Description + Appointment */}
          <div className="mt-10 pt-8 border-t border-gray-300">
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">
              About this property
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg max-w-5xl">
              {property.property_description}
            </p>

            {property.is_available && (
              <div className="mt-10 pt-8 border-t border-gray-300">
                <h3 className="text-3xl font-semibold text-gray-800 mb-4">
                  Schedule a Visit
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setError("");
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleBookClick}
                    className="w-full sm:w-auto px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold"
                  >
                    Book Appointment
                  </button>
                </div>
                {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
              </div>
            )}
          </div>
        </div>

        <ConfirmModal
          show={showModal}
          onClose={closeModal}
          onConfirm={handleConfirmBooking}
          bookingStatus={bookingStatus}
          propertyTitle={property.title}
          selectedDate={selectedDate}
        />
      </div>

      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: "" })}
        />
      )}
    </>
  );
};

export default Property;
