/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {  Globe, Megaphone, Mail, Star, X } from "lucide-react";

export default function PressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const highlights = [
    {
      icon: <Star className="w-8 h-8 text-[#DC3173]" />,
      title: "Fastest-Growing Quick Commerce Startup",
      desc: "Deligo is redefining convenience — from food delivery to ride-sharing and daily essentials.",
    },
    {
      icon: <Globe className="w-8 h-8 text-[#DC3173]" />,
      title: "Expanding Across Regions",
      desc: "Our smart logistics network connects cities and customers with seamless technology.",
    },
    {
      icon: <Megaphone className="w-8 h-8 text-[#DC3173]" />,
      title: "Empowering Local Businesses",
      desc: "Deligo helps local stores, restaurants, and drivers grow digitally and efficiently.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 relative">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#DC3173] to-[#7e1e4d] text-white py-24 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold mb-4"
        >
          Deligo in the Press
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-100"
        >
          Discover how Deligo is shaping the future of quick commerce — connecting cities, people, and businesses.
        </motion.p>
      </section>

      {/* Highlights */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          Our Journey in Headlines
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all"
            >
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Press & Media Resources */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
        >
          Press & Media Resources
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-gray-600 mb-10"
        >
          For all media inquiries, interviews, or brand assets — contact our press team. We’ll respond within 24 hours.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#DC3173] text-white rounded-full font-semibold shadow-md hover:bg-[#b72460] transition"
        >
          <Mail className="w-5 h-5" />
          Contact Media Team
        </motion.button>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && <ContactModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Modal Component ---------------- */
function ContactModal({ onClose }: { onClose: () => void }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log("Media Inquiry:", data);
    alert("Message sent successfully!");
    reset();
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full relative"
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#DC3173] transition"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Contact Media Team
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("name", { required: true })}
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#DC3173] outline-none"
          />
          {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#DC3173] outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

          <input
            {...register("subject", { required: true })}
            placeholder="Subject"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#DC3173] outline-none"
          />
          {errors.subject && <p className="text-red-500 text-sm">Subject is required</p>}

          <textarea
            {...register("message", { required: true })}
            placeholder="Your Message"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#DC3173] outline-none"
          />
          {errors.message && <p className="text-red-500 text-sm">Message is required</p>}

          <button
            type="submit"
            className="w-full bg-[#DC3173] text-white font-semibold py-3 rounded-full hover:bg-[#b72460] transition"
          >
            Send Message
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
