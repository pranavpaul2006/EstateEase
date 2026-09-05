import React from "react";
import { FiHome, FiCalendar, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="pt-10 bg-gray-50 text-gray-900 antialiased">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#f5f5f5] py-20">
        <div className="flex items-center justify-center px-6 sm:px-12 md:px-16 lg:px-20 xl:px-32">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-4xl text-center"
          >
            <h1 className="text-gray-900 font-extrabold leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              EstateEase — Find, Visit, & Own
            </h1>
            <p className="mt-4 mx-auto max-w-3xl text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
              Simplifying property transactions with verified listings, instant booking,
              and trusted broker support — all from one secure platform.
              Your next home is closer than you think.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              <a
                href="/buy"
                className="inline-block bg-[#154445] text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
              >
                Browse Properties
              </a>
              <a
                href="#features"
                className="inline-block bg-white text-[#154445] border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-100 transition"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-14 md:py-20">
        <div className="w-full px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 md:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#154445] mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                At <span className="font-semibold">EstateEase</span>, we make property transactions human, transparent and fast. We connect buyers, sellers and trusted local brokers on a single, secure platform — so you can find and visit properties with confidence.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex gap-3 items-start">
                  <span className="mt-1 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#e6faf6] text-[#0f6b62]">
                    <FiHome className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-semibold">Verified Listings</div>
                    <div className="text-gray-600 text-sm">Hand-checked property details to reduce fraud and uncertainty.</div>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="mt-1 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#e6faf6] text-[#0f6b62]">
                    <FiCalendar className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-semibold">Easy Booking</div>
                    <div className="text-gray-600 text-sm">Schedule visits, get reminders and manage bookings from your profile.</div>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="mt-1 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#e6faf6] text-[#0f6b62]">
                    <FiUsers className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-semibold">Broker Support</div>
                    <div className="text-gray-600 text-sm">Optional broker assistance with clear and fair fees.</div>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 md:order-2"
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop"
                alt="modern interior"
                className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-10 bg-white">
        <div className="w-full px-4 lg:px-8">
          <h3 className="text-3xl font-bold text-[#154445] text-center mb-8">Why choose EstateEase?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FiHome, title: "Trusted Listings", desc: "Only verified properties to reduce risk and increase trust." },
              { icon: FiCalendar, title: "Book Visits", desc: "Pick a time, get reminders, and cancel easily if needed." },
              { icon: FiUsers, title: "Fair Brokerage", desc: "Transparent and minimal fees — no hidden charges." },
            ].map((feature, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-6 rounded-2xl shadow-sm bg-gray-50 text-center cursor-pointer"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-white/70 mx-auto mb-4">
                  <feature.icon className="text-3xl text-[#0f6b62]" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="w-full px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl py-10 px-6 md:px-12 bg-gradient-to-r from-[#154445] to-[#0f6b62] text-white shadow-lg"
          >
            <h4 className="text-2xl md:text-3xl font-bold mb-3">Ready to find your next home?</h4>
            <p className="mb-6 text-white/90 max-w-2xl mx-auto">Discover verified listings, schedule visits, and move forward with confidence — all from one place.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a href="/buy" className="inline-block bg-white text-[#154445] font-semibold px-6 py-3 rounded-full shadow hover:opacity-95 transition">Browse Properties</a>
              <a href="/profile" className="inline-block border border-white/30 px-6 py-3 rounded-full text-white hover:bg-white/10 transition">My Profile</a>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EstateEase — Built for simple, secure property transactions.
      </footer>
    </div>
  );
}
