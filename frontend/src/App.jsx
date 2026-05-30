import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabaseClient";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Property from "./pages/Property";
import LoginBox from "./components/login_box";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Buy from "./components/buy";
import Sell from "./components/Sell";
import AboutUs from "./components/aboutus";

function App() {
  // --- Use Auth Context ---
  const { user, loading } = useAuth();

  // --- State Management ---
  const [showLogin, setShowLogin] = useState(false);

  const isLoggedIn = !!user;



  // --- Handlers ---
  const handleLoginClick = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);
  const handleLoginSuccess = () => {
    setShowLogin(false);
  };



  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar onLoginClick={handleLoginClick} isLoggedIn={isLoggedIn} />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Home />
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/buy"
            element={
              <Buy />
            }
          />
          <Route
            path="/sell"
            element={
              <Sell currentUser={user} />
            }
          />
          <Route path="/about" element={<AboutUs />} />
          <Route
            path="/cart"
            element={
              <Cart />
            }
          />
          <Route
            path="/property/:id"
            element={
              <Property currentUser={user} />
            }
          />

          {/* Protected Route - use user from context */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="relative">
            <button
              onClick={handleCloseLogin}
              className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-1 text-gray-700 hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <LoginBox onAuthSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;