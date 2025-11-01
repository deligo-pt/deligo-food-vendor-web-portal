// ContactUsPremium.tsx
"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactUsPremium() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Here you can integrate your API / Email service
  };

  return (
    <section className="py-24 px-6 sm:px-10 lg:px-20 bg-gray-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 shadow-2xl"
        >
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Need help or want a personal demo?
          </h2>
          <p className="text-gray-300 mb-8">
            Fill out the form and our team will reach out promptly. Takes less than 2 minutes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full px-5 py-3 rounded-2xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full px-5 py-3 rounded-2xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone (Optional)"
              className="w-full px-5 py-3 rounded-2xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows={5}
              className="w-full px-5 py-3 rounded-2xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF7EB3] to-[#DC3173] text-white font-bold text-lg hover:scale-105 hover:shadow-2xl transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 bg-gray-800 rounded-2xl p-4 hover:bg-[#DC3173]/10 transition cursor-pointer">
              <Phone className="w-6 h-6 text-pink-400" />
              <div>
                <p className="text-gray-300 text-sm">WhatsApp</p>
                <a href="https://wa.me/YOUR_NUMBER" className="text-white font-medium hover:text-pink-400 transition">
                  +351 900 123 456
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-800 rounded-2xl p-4 hover:bg-[#DC3173]/10 transition cursor-pointer">
              <Mail className="w-6 h-6 text-pink-400" />
              <div className="flex-1 min-w-0">
  <a
    href="mailto:support@deligo.pt"
    className="block text-white font-medium hover:text-pink-400 transition-all truncate"
    title="support@deligo.pt"
  >
    support@deligo.pt
  </a>
</div>
            </div>
            <div className="flex items-center gap-3 bg-gray-800 rounded-2xl p-4 hover:bg-[#DC3173]/10 transition cursor-pointer">
              <MessageCircle className="w-6 h-6 text-pink-400" />
              <div>
                <p className="text-gray-300 text-sm">Live Chat</p>
                <a href="/live-chat" className="text-white font-medium hover:text-pink-400 transition">
                  Start Chat
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-800 rounded-2xl p-4 hover:bg-[#DC3173]/10 transition cursor-pointer">
              <MapPin className="w-6 h-6 text-pink-400" />
              <div>
                <p className="text-gray-300 text-sm">Office</p>
                <span className="text-white font-medium">Lisbon, Portugal</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Map & Promo */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden shadow-2xl"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.123456789!2d-9.139337184593682!3d38.73694697958517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19331cd8eab1a7%3A0x123456789abcdef!2sLisbon%2C%20Portugal!5e0!3m2!1sen!2s!4v1690000000000!5m2!1sen!2s"
            width="100%"
            height="100%"
            className="rounded-3xl min-h-[500px]"
            allowFullScreen
            loading="lazy"
            title="Lisbon HQ Map"
          />
        </motion.div>
      </div>
    </section>
  );
}
