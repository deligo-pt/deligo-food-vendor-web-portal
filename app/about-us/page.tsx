"use client";

import { motion } from "framer-motion";
import {
  Bike,
  ShoppingBag,
  Truck,
  Clock,
  HeartHandshake,
  Globe,
  Store,
} from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      {/* HERO SECTION */}
      <section className="relative text-center px-6 py-24 overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 bg-clip-text text-transparent"
        >
          About <span className="text-white">DeliGo</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto mt-6 text-gray-300 text-lg leading-relaxed"
        >
          DeliGo is a next-generation quick-commerce platform that brings
          groceries, meals, rides, and daily essentials to your doorstep —
          faster, smarter, and more reliable than ever.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"
        />
      </section>

      {/* OUR STORY */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-green-400">
              Our Story
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Born with a mission to simplify everyday life,{" "}
              <span className="text-white font-semibold">DeliGo</span> aims to
              connect people with what they need — food, groceries, rides, or
              essentials — in just a few taps. Inspired by the speed and
              efficiency of next-gen delivery systems, we’re building a
              platform that makes city life easier and smarter.
            </p>
            <p className="text-gray-400 mt-4">
              From a small idea to a fast-growing ecosystem, DeliGo is designed
              for convenience, trust, and accessibility. We believe every order
              — big or small — deserves to arrive fast, fresh, and safe.
            </p>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            src="/images/delivery-illustration.svg"
            alt="Delivery Illustration"
            className="rounded-3xl shadow-2xl"
          />
        </div>
      </section>

      {/* OUR CORE VALUES */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-950 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-10 text-teal-400"
          >
            What Makes DeliGo Different
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <Truck className="w-10 h-10 text-green-400" />,
                title: "Ultra-Fast Delivery",
                desc: "We ensure your orders reach you within minutes — not hours. Speed and precision define every delivery.",
              },
              {
                icon: <ShoppingBag className="w-10 h-10 text-blue-400" />,
                title: "All-in-One Platform",
                desc: "From food and grocery to ride sharing — everything you need, all in one simple, intuitive app.",
              },
              {
                icon: <Bike className="w-10 h-10 text-yellow-400" />,
                title: "Empowered Riders",
                desc: "Our riders are the heart of DeliGo — equipped, trained, and valued for every delivery they make.",
              },
              {
                icon: <Store className="w-10 h-10 text-pink-400" />,
                title: "Local Business Support",
                desc: "We partner with small and local businesses, helping them reach customers faster and grow digitally.",
              },
              {
                icon: <HeartHandshake className="w-10 h-10 text-purple-400" />,
                title: "Customer First Approach",
                desc: "Our mission is simple — make life easier for our users through fast, friendly, and reliable service.",
              },
              {
                icon: <Clock className="w-10 h-10 text-orange-400" />,
                title: "24/7 Availability",
                desc: "Day or night, rain or shine — DeliGo is always ready to serve your needs without delay.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-8 bg-gray-900/70 rounded-3xl shadow-lg hover:shadow-green-500/20 transition-all"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR VISION */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-950 via-gray-900 to-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            src="/images/future-delivery.svg"
            alt="Future of Delivery"
            className="rounded-3xl shadow-2xl order-2 md:order-1"
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2"
          >
            <h2 className="text-4xl font-bold mb-4 text-green-400">
              Our Vision for the Future
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We’re building a future where technology connects people, products,
              and places effortlessly. DeliGo will soon introduce features like
              smart order tracking, vendor insights, and AI-powered route
              optimization to make commerce faster than ever.
            </p>
            <p className="text-gray-400 mt-4">
              As we expand, our focus remains the same — building trust through
              reliability, innovation, and speed. Because DeliGo isn’t just about
              delivery — it’s about redefining convenience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* GLOBAL IMPACT */}
      <section className="py-20 text-center px-6 bg-black/80">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-green-400 mb-6"
        >
          Expanding Beyond Boundaries
        </motion.h2>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg mb-8">
          DeliGo’s mission goes beyond borders — we aim to redefine urban
          convenience across multiple countries, connecting riders, vendors,
          and users in a seamless global network.
        </p>
        <Globe className="w-20 h-20 mx-auto text-green-400 animate-spin-slow" />
      </section>

    </div>
  );
}
