"use client";

import { motion } from "framer-motion";
import {
  Boxes,
  Edit3,
  Upload,
  CheckCircle,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";

export default function ManageProductsInfoPage() {
  const steps = [
    {
      icon: <Upload className="w-8 h-8 text-pink-500" />,
      title: "Easily Add Your Products",
      description:
        "Upload your product images, details, and pricing in just a few clicks using our simplified product upload system.",
    },
    {
      icon: <Edit3 className="w-8 h-8 text-purple-500" />,
      title: "Edit Instantly Anytime",
      description:
        "Need to update stock, description, or price? Do it instantly — changes reflect across your store in seconds.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-indigo-500" />,
      title: "Track Product Performance",
      description:
        "View how your products are performing — best sellers, low stock alerts, and sales trends all in one dashboard.",
    },
    {
      icon: <Settings className="w-8 h-8 text-blue-500" />,
      title: "Smart Management Tools",
      description:
        "Automate repetitive updates, set visibility schedules, and manage your entire inventory effortlessly.",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-black min-h-screen text-white py-20 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400">
            Manage Products Seamlessly
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            DeliGo is bringing a smarter way for vendors to manage their products — simple,
            visual, and lightning fast.  
          </p>
        </motion.div>

        {/* FEATURES / STEPS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-8 bg-gray-800/60 rounded-3xl shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-2 text-center"
            >
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* DEMO PREVIEW / MOCKUP */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-purple-700/20 via-pink-600/20 to-indigo-700/20 rounded-3xl p-10 shadow-inner text-center border border-white/10"
        >
          <Boxes className="w-14 h-14 text-pink-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-3">
            Manage All Products From One Dashboard
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            DeliGo’s upcoming vendor dashboard will let you view, update, and organize
            all your products with ease — no more switching between tabs or tools.
          </p>
          
        </motion.div>

        {/* FUTURE BENEFITS */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-extrabold text-pink-400">
              Why It’s a Game-Changer
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span>Real-time stock & pricing updates directly from your dashboard</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span>Auto-sync product visibility across all DeliGo partner platforms</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span>Performance insights and growth analytics at your fingertips</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
            <Sparkles className="w-56 h-56 text-pink-500/40 animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
