// ContactSupportSection.tsx
"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactSupportSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement form submission logic (API / Email service)
    console.log(formData);
  };

  return (
    <section className="py-20 px-6 sm:px-10 lg:px-20 bg-gray-900 rounded-3xl shadow-2xl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-800 rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Need help or want a personal demo?
          </h2>
          <p className="text-gray-300 mb-8">
            Fill out the form and our team will reach out to you promptly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone (Optional)"
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#FF7EB3] to-[#DC3173] text-white font-bold text-lg hover:scale-105 hover:shadow-lg transition"
            >
              Send Message
            </button>
          </form>

          {/* Support Links */}
          <div className="mt-8 flex flex-wrap gap-6 text-white">
            <a href="https://wa.me/YOUR_NUMBER" target="_blank" className="flex items-center gap-2 hover:text-pink-400 transition">
              <Phone className="w-5 h-5" /> WhatsApp
            </a>
            <a href="mailto:support@yourplatform.com" className="flex items-center gap-2 hover:text-pink-400 transition">
              <Mail className="w-5 h-5" /> Email
            </a>
            <a href="/live-chat" className="flex items-center gap-2 hover:text-pink-400 transition">
              <MessageCircle className="w-5 h-5" /> Live Chat
            </a>
          </div>
        </motion.div>

        {/* Right: Map & Office Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden shadow-xl"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.123456789!2d-9.139337184593682!3d38.73694697958517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19331cd8eab1a7%3A0x123456789abcdef!2sLisbon%2C%20Portugal!5e0!3m2!1sen!2s!4v1690000000000!5m2!1sen!2s"
            width="100%"
            height="100%"
            className="rounded-3xl min-h-[400px]"
            allowFullScreen
            loading="lazy"
            title="Lisbon HQ Map"
          />
        </motion.div>
      </div>
    </section>
  );
}
