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
          About <span className="text-white">DeliGo Group</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto mt-6 text-gray-300 text-lg leading-relaxed"
        >
          Smart. Sustainable. Built for Portugal.
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
              About DeliGo Group
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We’re <span className="text-white font-semibold">DeliGo</span> — a
              Portuguese tech company reimagining how people move, eat, and
              live. From <span className="text-white font-semibold">DeliGo Ride</span>, our ride-sharing platform, to{" "}
              <span className="text-white font-semibold">DeliGo Delivery</span>,
              our food and grocery network — we connect people, drivers, and
              local businesses through technology that makes everyday life
              effortless.
            </p>
            <p className="text-gray-400 mt-4">
              Our mission is simple: move smarter, live better.
            </p>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            src="/deligoDelivery.jpeg"
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
            DeliGo Ride — The Smarter Way to Move
          </motion.h2>

          <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed mb-10">
            Need to get somewhere fast? DeliGo Ride gets you there. We connect
            passengers with licensed TVDE drivers through a clean, easy-to-use
            app — offering safe, comfortable, and affordable rides across
            Portugal.
            <br />
            <br />
            We care about the planet too. Our growing fleet includes electric
            and hybrid cars, helping make cities greener and cleaner.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <Truck className="w-10 h-10 text-green-400" />,
                title: "Fast pickup & transparent pricing",
                desc: "Get to your destination quickly and affordably.",
              },
              {
                icon: <HeartHandshake className="w-10 h-10 text-blue-400" />,
                title: "Certified professional drivers",
                desc: "Trained and verified drivers ensure safe rides.",
              },
              {
                icon: <Clock className="w-10 h-10 text-yellow-400" />,
                title: "Real-time ride tracking",
                desc: "Track your driver and trip from pickup to drop-off.",
              },
              {
                icon: <ShoppingBag className="w-10 h-10 text-pink-400" />,
                title: "Multiple payment methods",
                desc: "Pay easily via Card or MB Way — no hassle.",
              },
              {
                icon: <Bike className="w-10 h-10 text-purple-400" />,
                title: "Eco-friendly fleet",
                desc: "Electric and hybrid vehicles for a cleaner planet.",
              },
              {
                icon: <Store className="w-10 h-10 text-orange-400" />,
                title: "Reliable service",
                desc: "Wherever you’re headed — we’ll get you there safely and on time.",
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
            src="/deligoabout.jpeg"
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
              DeliGo Delivery — Eat, Shop, and Get It Fast
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Craving your favorite meal or need groceries now? DeliGo Delivery
              brings it all to your door — food, groceries, and everyday
              essentials.
            </p>
            <p className="text-gray-400 mt-4">
              We partner with local restaurants, supermarkets, and stores to
              give customers what they need, when they need it.
            </p>
            <ul className="text-gray-300 mt-4 space-y-2">
              <li>⚡ Super-fast deliveries</li>
              <li>📦 Live order tracking</li>
              <li>❤️ Support for local businesses</li>
              <li>💰 Easy payments & cashback</li>
              <li>🚴 Reliable delivery partners you can trust</li>
            </ul>
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
          DeliGo Electronic Accessories — Powering Everyday Life
        </motion.h2>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg mb-8">
          Smart. Stylish. Reliable. DeliGo Electronic Accessories brings
          innovation and design to your everyday tech. We create high-quality
          accessories that combine smart technology with sleek, durable design —
          built for modern lifestyles.
        </p>
        <p className="max-w-3xl mx-auto text-gray-400 text-lg mb-8">
          Our mission: make technology easier, faster, and smarter for everyone.
        </p>
        <ul className="max-w-3xl mx-auto text-gray-300 text-lg space-y-2 mb-8 text-left sm:text-center">
          <li>🔋 Smart Chargers & Power Banks — Fast, safe, and long-lasting.</li>
          <li>🔌 Cables & Adapters — Premium build, high-speed performance.</li>
          <li>🎧 Earphones & Headphones — Clear sound and comfort.</li>
          <li>⌚ Smartwatches & Wearables — Stay connected and active.</li>
          <li>💻 Laptop & Desktop Accessories — Boost productivity anywhere.</li>
        </ul>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg mb-8">
          We’re not just delivering — we’re connecting communities and powering
          progress.
        </p>
      </section>

      {/* OUR PROMISE */}
      <section className="py-20 text-center px-6 bg-black/90">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-green-400 mb-6"
        >
          Our Vision & Promise
        </motion.h2>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg mb-4">
          To make every city smarter, cleaner, and more connected — powered by
          technology that works for people and the planet.
        </p>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg mb-8">
          We’re building a future where mobility and delivery feel effortless — 
          a future that’s eco-friendly, inclusive, and proudly Portuguese.
        </p>
        <Globe className="w-20 h-20 mx-auto text-green-400 animate-spin-slow" />
      </section>
    </div>
  );
}
