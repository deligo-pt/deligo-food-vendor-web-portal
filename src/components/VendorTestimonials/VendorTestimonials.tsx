"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Maria Fernandes",
    store: "Lisboa Fresh Market",
    city: "Lisbon",
    img: "/vendors/maria.jpg",
    quote:
      "Since joining the platform, my sales have doubled! The system is easy to use and customers love the fast delivery.",
  },
  {
    name: "João Pereira",
    store: "O Grelhador",
    city: "Porto",
    img: "/vendors/joao.jpg",
    quote:
      "A game-changer for my restaurant. We reached hundreds of new customers every week. Highly recommend joining!",
  },
  {
    name: "Ana Silva",
    store: "Mercado Verde",
    city: "Coimbra",
    img: "/vendors/ana.jpg",
    quote:
      "I love how transparent the payments are. Weekly payouts make managing finances so much easier.",
  },
  {
    name: "Ricardo Lopes",
    store: "Café do Bairro",
    city: "Braga",
    img: "/vendors/ricardo.jpg",
    quote:
      "The platform helped us grow from a local café to a city favorite. The team is always supportive!",
  },
];

export default function VendorTestimonials() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-[#0A0F1F] via-[#111B2E] to-[#0A0F1F]">
      {/* Background Glows */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#DC3173]/20 blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#FF6F61]/20 blur-[150px] animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#DC3173] to-[#FF6F61] mb-14"
        >
          See How Local Businesses are Growing with Us
        </motion.h2>

        <div className="relative flex items-center justify-center">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-0 text-white/60 hover:text-white text-3xl sm:text-4xl transition-all"
          >
            ‹
          </button>

          {/* Carousel */}
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.6 }}
            className="bg-[#151F35]/80 backdrop-blur-md border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(255,111,97,0.3)] hover:shadow-[0_0_50px_rgba(255,111,97,0.5)] p-10 max-w-3xl mx-auto flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 mb-6 relative">
              <Image
                src={testimonials[current].img}
                alt={testimonials[current].name}
                fill
                className="rounded-full object-cover border-4 border-[#DC3173]"
              />
            </div>
            <Quote className="w-10 h-10 text-[#FF6F61] mb-4" />
            <p className="text-lg text-white/90 italic mb-6 leading-relaxed">
              “{testimonials[current].quote}”
            </p>
            <h4 className="text-xl font-semibold text-white">
              {testimonials[current].name}
            </h4>
            <p className="text-[#FF6F61] font-medium">
              {testimonials[current].store}, {testimonials[current].city}
            </p>
          </motion.div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-0 text-white/60 hover:text-white text-3xl sm:text-4xl transition-all"
          >
            ›
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="mt-8 flex justify-center space-x-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-gradient-to-r from-[#DC3173] to-[#FF6F61] scale-125"
                  : "bg-white/30 hover:bg-white/60"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
