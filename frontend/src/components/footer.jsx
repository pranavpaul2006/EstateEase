import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2b6777] text-white text-center py-4 text-sm w-full mt-auto">
      © {currentYear} EstateEase. All rights reserved.
    </footer>
  );
}