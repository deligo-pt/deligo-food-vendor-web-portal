"use client";
import { motion } from "framer-motion";
import { Briefcase, Users, Rocket, HeartHandshake, Star } from "lucide-react";

export default function CareersPage() {
  const values = [
    {
      icon: <Users className="w-10 h-10 text-[#DC3173]" />,
      title: "Collaborative Culture",
      description:
        "At Deligo, teamwork is everything. From delivery partners to developers, everyone’s voice matters. We thrive on collaboration and innovation.",
    },
    {
      icon: <Rocket className="w-10 h-10 text-[#DC3173]" />,
      title: "Career Growth",
      description:
        "We believe in constant growth. Whether you're in tech, logistics, or support — Deligo gives you the platform to learn, lead, and grow faster.",
    },
    {
      icon: <HeartHandshake className="w-10 h-10 text-[#DC3173]" />,
      title: "Positive Impact",
      description:
        "Join a mission that connects people and simplifies lives. From food to rides, you’ll be part of a movement that impacts millions daily.",
    },
    {
      icon: <Star className="w-10 h-10 text-[#DC3173]" />,
      title: "Recognition & Rewards",
      description:
        "We value passion and dedication. At Deligo, your hard work is celebrated — not just through words but real opportunities and rewards.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#DC3173] to-[#9b1c54] text-white py-24 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold mb-6"
        >
          Build Your Future with <span className="text-yellow-300">Deligo</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-100"
        >
          Deligo isn’t just a platform — it’s a revolution in convenience. We bring together technology, people, and passion to make everyday life smarter, faster, and easier.
        </motion.p>
      </section>

      {/* About Working at Deligo */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Work at Deligo?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Joining Deligo means joining a family that’s driven by innovation and powered by people. Whether it’s delivering food, enabling local stores, or redefining mobility — you’ll play a role in shaping the future of quick commerce.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all"
            >
              <div className="mb-4 flex justify-center">{val.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{val.title}</h3>
              <p className="text-gray-600">{val.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Life at Deligo */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Life at Deligo
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-gray-300 text-lg mb-12"
          >
            We believe work should be more than just a job. It should be meaningful, inspiring, and fun. At Deligo, you’ll find flexible work culture, modern tools, creative minds, and endless learning opportunities.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Innovation Everyday", desc: "We love experimenting, building, and breaking boundaries." },
              { title: "People First", desc: "We care deeply about our team, partners, and users." },
              { title: "Empowerment", desc: "You’ll have the freedom to create and make real impact." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-xl p-6 hover:bg-[#DC3173]/20 transition-all"
              >
                <Briefcase className="w-8 h-8 text-[#DC3173] mb-3 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-20 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        >
          Be Part of Something Big
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-gray-600 max-w-3xl mx-auto mb-8"
        >
          We’re redefining the quick-commerce experience — connecting people, technology, and local businesses in one platform. Join Deligo and help us deliver the future, faster.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-[#DC3173] text-white font-semibold rounded-full shadow-md hover:bg-[#b92561] transition"
        >
          Join the Movement
        </motion.button>
      </section>
    </div>
  );
}
