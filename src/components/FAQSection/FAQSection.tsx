"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const faqData = [
  {
    question: "What documents are required to become a vendor?",
    answer:
      "You need a valid business registration, tax ID, and a proof of address. Additional documents may be required depending on your business type.",
  },
  {
    question: "How long does approval take?",
    answer:
      "Typically, vendor approval takes 24-48 hours after submitting all required documents.",
  },
  {
    question: "When will I receive payments?",
    answer:
      "Payments are processed weekly via SEPA transfer. You can track your earnings in real-time on your dashboard.",
  },
  {
    question: "Can I manage multiple locations?",
    answer:
      "Yes, you can add and manage multiple store locations under a single vendor account.",
  },
  {
    question: "What support is available?",
    answer:
      "24/7 multilingual support is available via chat, email, and phone for all vendors.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 px-6 sm:px-12 lg:px-28 bg-[#F9FAFB] rounded-3xl overflow-hidden">
      {/* Soft pink gradient top */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,49,115,0.09),transparent_70%)] pointer-events-none" />

      {/* Heading */}
      <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-14 text-center tracking-wide">
        Frequently Asked{" "}
        <span className="bg-linear-to-r from-[#DC3173] to-pink-600 bg-clip-text text-transparent">
          Questions
        </span>
      </h2>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="relative w-full h-[260px] sm:h-[360px] md:h-[700px] overflow-hidden rounded-3xl lg:flex-1">
          <Image
            src="/deligo_faq.jpeg"
            fill
            className="object-cover"
            alt="FAQ image"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="max-w-3xl mx-auto space-y-6 relative z-10 flex-1">
          {faqData.map((item, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                boxShadow:
                  activeIndex === i
                    ? "0px 8px 25px rgba(220,49,115,0.25)"
                    : "0px 4px 12px rgba(0,0,0,0.08)",
                scale: activeIndex === i ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 
            ${activeIndex === i
                  ? "border-[#DC3173]"
                  : "border-gray-300 hover:border-[#DC3173]/60"
                }`}
            >
              {/* Question Row */}
              <button
                onClick={() => toggleAccordion(i)}
                className="w-full px-6 py-6 flex justify-between items-center text-left"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {item.question}
                </span>

                <motion.span
                  animate={{ rotate: activeIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center justify-center"
                >
                  <ChevronDown className="w-6 h-6 text-[#DC3173]" />
                </motion.span>
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {activeIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        opacity: { duration: 0.3 },
                        y: { type: "spring", stiffness: 200, damping: 22 },
                        scale: { duration: 0.25 },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      scale: 0.98,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
