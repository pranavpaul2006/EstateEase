import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiLogOut,
  FiMail,
  FiPhone,
  FiMapPin,
  FiTrash2,
} from "react-icons/fi";
import EditProfileModal from "./EditProfileModal";
import ConfirmationModal from "./logout_box";
import { useAuth } from "../context/AuthContext";
import Notification from "./Notification";
import api from "../services/api";

function UserProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [listedProperties, setListedProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchAllUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. Fetch User Profile
        let profileData;
        try {
          const res = await api.get(`/users/${user.id}`);
          profileData = res.data;
        } catch (err) {
          if (err.response && err.response.status === 404) {
            // Create profile
            const createRes = await api.post("/users", { id: user.id, email: user.email, full_name: user.email.split('@')[0] });
            profileData = createRes.data;
          } else {
            throw err;
          }
        }
        setProfile(profileData);

        // 2. Fetch User's Listed Properties
        const propsRes = await api.get(`/users/${user.id}/properties`);
        setListedProperties(propsRes.data || []);

        // 3. Fetch User's Booking History
        const bookingsRes = await api.get(`/appointments/user/${user.id}`);
        setBookings(bookingsRes.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUserData();
  }, [user]);

  const handleSaveProfile = async (updatedData) => {
    if (!user) return;
    try {
      const formData = new FormData();
      formData.append("full_name", updatedData.name);
      formData.append("phone_number", updatedData.phone);
      formData.append("address", updatedData.address);
      if (updatedData.profileImageUrl && !updatedData.file) {
         formData.append("profile_image_url", updatedData.profileImageUrl);
      }
      if (updatedData.file) {
        formData.append("avatar", updatedData.file);
      }

      const res = await api.put(`/users/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfile(res.data);
      setIsEditModalOpen(false);
      setNotification({ show: true, message: "Profile updated successfully!" });
    } catch (error) {
      setNotification({ show: true, message: `Error: ${error.message}` });
    }
  };

  const handleLogoutClick = () => setShowLogoutConfirm(true);

  const handleConfirmLogout = async () => {
    try {
      await signOut();
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = "/";
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      // Deleting booking - not implemented on backend, but let's assume we can add it, or we skip actual delete if no endpoint
      // Let's call api.delete
      await api.delete(`/appointments/${itemToDelete.appointment_id || itemToDelete.id}`);
      
      setBookings((prev) =>
        prev.filter((b) => (b.appointment_id || b.id) !== (itemToDelete.appointment_id || itemToDelete.id))
      );
      setNotification({
        show: true,
        message: "Booking cancelled successfully.",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      setNotification({ show: true, message: `Error: ${error.message}` });
    } finally {
      setItemToDelete(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return <div className="text-center py-40 text-red-500">Error: {error}</div>;
  if (!user || !profile)
    return (
      <div className="text-center py-40">
        <p>Please log in to view your profile.</p>
        <Link to="/login">
          <button className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg">
            Login
          </button>
        </Link>
      </div>
    );

  return (
    <>
      <div className="bg-gray-50 min-h-screen pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center sticky top-28">
              <img
                src={
                  profile.profile_image_url || profile.avatar_url ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${profile.email}`
                }
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 p-1 object-cover"
              />
              <h2 className="text-2xl font-bold text-gray-800">
                {profile.full_name || profile.email}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Member since{" "}
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  <FiEdit /> <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  <FiLogOut /> <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
                Account Details
              </h3>
              <ul className="space-y-5 text-gray-700">
                <li className="flex items-center text-lg">
                  <FiMail className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">{profile.email}</span>
                </li>
                <li className="flex items-center text-lg">
                  <FiPhone className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">
                    {profile.phone_number || "Not provided"}
                  </span>
                </li>
                <li className="flex items-center text-lg">
                  <FiMapPin className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">
                    {profile.address || "Not provided"}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
                My Appointments
              </h3>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const property = booking.properties || {};
                    const primaryImage = property.property_images?.find(img => img.is_primary);
                    const displayImageUrl = primaryImage?.image_url || property.property_images?.[0]?.image_url || booking.img || "https://via.placeholder.com/150";

                    let formattedDate = "Invalid Date"; 
                    if (booking.meeting_time) {
                      try {
                        formattedDate = new Date(booking.meeting_time).toLocaleDateString("en-US", {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        });
                      } catch (e) { }
                    }

                    const displayTitle = property.title || "Property Title Not Found";
                    const displayLocation = property.location || "Property Location Not Found";
                    const bookingId = booking.appointment_id || booking.id;

                    return (
                      <div key={bookingId} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                        <img 
                          src={displayImageUrl} 
                          alt={displayTitle} 
                          className="w-24 h-20 object-cover rounded-md" 
                        />
                        <div className="flex-grow">
                          <p className="font-bold text-gray-800">{displayTitle}</p>
                          <p className="text-sm text-gray-600">{displayLocation}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-700">Booked for:</p>
                          <p className="text-sm text-blue-600">{formattedDate}</p>
                        </div>
                        <button 
                          onClick={() => setItemToDelete(booking)} 
                          className="p-2 text-gray-400 hover:text-red-500 rounded-full transition"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>You have no upcoming appointments.</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
                My Listed Properties
              </h3>
              {listedProperties.length > 0 ? (
                <div className="space-y-4">
                  {listedProperties.map((property) => {
                    const image = property.image_url || property.property_images?.[0]?.image_url || "https://via.placeholder.com/150";
                    return (
                      <div
                        key={property.property_id || property.id}
                        className="flex items-center gap-4"
                      >
                        <img
                          src={image}
                          alt={property.title}
                          className="w-24 h-20 object-cover rounded-md"
                        />
                        <div className="flex-grow">
                          <p className="font-bold text-gray-800">
                            {property.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {property.location}
                          </p>
                        </div>
                        <Link to={`/property/${property.property_id || property.id}`}>
                          <button className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">
                            View Details
                          </button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>You have not listed any properties yet.</p>
                  <Link to="/sell">
                    <button className="mt-4 bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600">
                      List a Property
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          user={{
            name: profile.full_name,
            email: profile.email,
            phone: profile.phone_number,
            address: profile.address,
            profileImageUrl: profile.profile_image_url || profile.avatar_url,
          }}
          onSave={handleSaveProfile}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {showLogoutConfirm && (
        <ConfirmationModal
          message="Are you sure you want to log out?"
          onConfirm={handleConfirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
      {itemToDelete && (
        <ConfirmationModal
          message={`Are you sure you want to cancel this appointment?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setItemToDelete(null)}
        />
      )}
      {notification.show && (
        <Notification
          message={notification.message}
          onClose={() => setNotification({ show: false, message: "" })}
        />
      )}
    </>
  );
}

export default UserProfile;
